import { remote } from 'electron';

import fs from 'fs';

const mainApp = (state = {}, action) => {
    switch (action.type) {
        case 'SET_SAVE_PATH':
            if (state.savePath !== action.savePath) {
                let saveData = fs.readFileSync(action.savePath[0]);
                return {
                    save: {
                        saveData: saveData,
                        savePath: action.savePath
                    }
                };
            }
            return state;
        default:
            let save = remote.getGlobal('save');
            return {save};
    }
};

export default mainApp;