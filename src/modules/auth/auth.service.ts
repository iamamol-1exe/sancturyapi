import bcrypt from "bcrypt";
import { sequelize } from "../../infra/db/postgres";
import { Oauth } from "../../infra/models/oauth.model";
import { User } from "../../infra/models/user.model";

type OAuthUserPayload = {
  provider: "google";
  providerAccountId: string;
  email: string | null;
  displayName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn?: number | null;
};

class AuthService {
  async upsertOAuthUser(payload: OAuthUserPayload) {
    const expiresAt = new Date(Date.now() + (payload.expiresIn ?? 3600) * 1000);

    return sequelize.transaction(async (transaction) => {
      const existingOauth = await Oauth.findOne({
        where: {
          provider: payload.provider,
          providerAccountId: payload.providerAccountId,
        },
        transaction,
      });

      if (existingOauth) {
        await existingOauth.update(
          {
            accessToken: payload.accessToken ?? "",
            refreshToken: payload.refreshToken ?? "",
            expiresAt,
          },
          { transaction },
        );

        const linkedUser = await User.findByPk(existingOauth.userId, {
          transaction,
        });

        if (linkedUser) {
          return linkedUser;
        }
      }

      const email = payload.email?.toLowerCase() ?? null;
      let user = email
        ? await User.findOne({ where: { email }, transaction })
        : null;

      if (!email) {
        return;
      }

      if (!user) {
        const username = await this.buildUniqueUsername(
          payload.displayName,
          email,
          payload.providerAccountId,
          transaction,
        );
        const passwordHash = await this.generateHash(email);
        user = await User.create(
          {
            email,
            name: payload.displayName ?? username,
            username,
            passwordHash: passwordHash,
          },
          { transaction },
        );
      }

      await Oauth.upsert(
        {
          provider: payload.provider,
          providerAccountId: payload.providerAccountId,
          accessToken: payload.accessToken ?? "",
          refreshToken: payload.refreshToken ?? "",
          expiresAt,
          userId: user.id,
        },
        { transaction },
      );

      return user;
    });
  }

  private async buildUniqueUsername(
    displayName: string | null,
    email: string | null,
    providerAccountId: string,
    transaction: any,
  ) {
    const baseFromEmail = email ? email.split("@")[0] : null;
    const baseFromName = displayName
      ? displayName.replace(/[^a-zA-Z0-9_]/g, "")
      : null;
    const base = (baseFromName || baseFromEmail || "user").toLowerCase();

    const candidate = base || "user";
    const exists = await User.findOne({
      where: { username: candidate },
      transaction,
    });

    if (!exists) {
      return candidate;
    }

    const suffix = providerAccountId.slice(-6);
    const alternate = `${candidate}_${suffix}`;
    const existsAlternate = await User.findOne({
      where: { username: alternate },
      transaction,
    });

    if (!existsAlternate) {
      return alternate;
    }

    return `${candidate}_${Date.now()}`;
  }

  public async generateHash(email: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(email, 10);
    return hashedPassword;
  }
  public async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export default new AuthService();
