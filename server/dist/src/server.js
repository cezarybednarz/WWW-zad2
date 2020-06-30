"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const server = app_1.app.listen(1500, () => {
    console.log(`App is running at http://localhost:1500 in ${app_1.app.get('env')} mode`);
    console.log('Press Ctrl+C to stop.');
});
//# sourceMappingURL=server.js.map