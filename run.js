let Simulation = require("./Simulation").Simulation;

let argument = process.argv.slice(2);
let mode;

const printUsage = () => {
    console.log(`BitRewards Token (BIT) price 5-year prediction (market simulation). 
 
Usage:    
node run.js [normal|icodrop10|sell100]`);
    process.exit(1);
};

if (argument.length == 0) {
    printUsage();
} else {
    switch (argument[0]) {
        case 'normal':
            mode = Simulation.MODE_NORMAL;
            break;
        case 'icodrop10':
            mode = Simulation.MODE_ICO_DROP_10;
            break;
        case 'icodrop20':
            mode = Simulation.MODE_ICO_DROP_20;
            break;
        case 'sell100':
            mode = Simulation.MODE_SELL_100;
            break;
        default:
            printUsage();
    }
}

(new Simulation()).run(mode);