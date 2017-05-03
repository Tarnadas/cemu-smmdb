import { remote } from 'electron';

import fs from 'fs';

const mainApp = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_SAVE':
            let appSaveData = state.save.appSaveData;
            if (!appSaveData.cemuSavePath) {
                appSaveData.cemuSavePath = [action.cemuSavePath];
            } else {
                let ar = appSaveData.cemuSavePath;
                ar.push(action.cemuSavePath);
                appSaveData.cemuSavePath = ar;
            }
            console.log(appSaveData.cemuSavePath);
            fs.writeFileSync(state.save.appSavePath, JSON.stringify(appSaveData));
            return {
                save: {
                    appSaveData: appSaveData,
                    appSavePath: state.save.appSavePath,
                    cemuSave: action.cemuSave
                }
            };
            return state;
            break;
        case 'LOAD_SAVE':
            return {
                save: {
                    appSaveData: state.save.appSaveData,
                    appSavePath: state.save.appSavePath,
                    cemuSave: action.cemuSave
                }
            };
        default:
            let save = remote.getGlobal('save');
            console.log(save);
            return {save};
    }
};

export default mainApp;