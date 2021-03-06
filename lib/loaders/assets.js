/*!
 * damless
 * Copyright(c) 2018 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
const { 
    UndefinedError, 
    Error 
} = require("oups");
const path = require("path");
const Asset = require("../routes/asset");

class AssetsLoader {
    constructor(giveme, httpRouter, fs, config, walk) {
        if (!giveme) throw new UndefinedError("giveme");
        if (!httpRouter) throw new UndefinedError("httpRouter");
        if (!fs) throw new UndefinedError("fs");
        if (!config) throw new UndefinedError("config");
        if (!walk) throw new UndefinedError("walk");
        this.giveme = giveme;
        this.httpRouter = httpRouter;
        this.fs = fs;
        this.config = config;
        this.walk = walk;
    };
    
    //Do not use mount, need to be call manualy.
    async load() {
        const { 
            config, 
            fs, 
            walk, 
            httpRouter, 
            giveme 
        } = this;
        
        if(!config.assets || /false/ig.test(config.assets)) return;
       const folder = path.resolve(giveme.root, config.assets);
        try {
            const stat = await fs.stat(folder);
        }
        catch (error) {
            throw new Error("Failed to read public assets folder ${folder}.", { folder: folder }, error);
        }
        const files = walk.get(folder);
        for (let filepath of files) {
            let route = filepath.substring(folder.length);
            try {
                const options = { auth: false };
                await httpRouter.asset(route, filepath, options);
            }
            catch(error) {
                console.error(error);
            }
        }
    };
};

exports = module.exports = AssetsLoader;