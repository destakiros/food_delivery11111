
/**
 * In-N-Out Logistics Mock Server v4.0
 * Simulates a Node.js/Express environment.
 */

const mockServer = {
    init() {
        console.log("🚀 [SERVER] In-N-Out Mock Hub initialized.");
        console.log("📍 [DATABASE] Connection to Simulated MongoDB established.");
    },
    config: {
        port: 5000,
        apiPrefix: "/api/v1",
        version: "4.0.0-BETA"
    }
};

export default mockServer;
