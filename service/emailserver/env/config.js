
import settings from "./settings.json";

const config = () => {
    const currentEnvName = process.env.NODE_ENV || "development";
    const currentEnv = settings[currentEnvName];
    if (currentEnv) {
        Object.keys(currentEnv).forEach(
            key => (process.env[key] = currentEnv[key])
        );
    }
};

export default config;
