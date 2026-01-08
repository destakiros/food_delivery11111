
/**
 * Mock Database Configuration
 */
export const dbConfig = {
    uri: "mongodb://simulated:27017/innout_logistics",
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

export const connectDB = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("🟢 [DB] MongoDB Simulation Ready.");
            resolve(true);
        }, 500);
    });
};
