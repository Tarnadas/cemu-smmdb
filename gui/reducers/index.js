import { remote } from 'electron';

import fs from 'fs';

const mainApp = (state = {}, action) => {
    switch (action.type) {
        case 'SET_SAVE':
            if (state.save.cemuSavePath !== action.cemuSavePath) {
                let appSaveData = state.save.appSaveData;
                appSaveData.cemuSavePath = action.cemuSavePath;
                fs.writeFileSync(state.save.appSavePath, JSON.stringify(appSaveData));
                return {
                    save: {
                        appSaveData: appSaveData,
                        appSavePath: state.save.appSavePath,
                        cemuSave: action.cemuSave,
                        cemuSavePath: action.cemuSavePath
                    }
                };
            }
            return state;
        default:
            let save = remote.getGlobal('save');
            console.log(save);
            return {save};
    }
};

export default mainApp;