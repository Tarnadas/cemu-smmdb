import { Map } from 'immutable';
import { remote } from 'electron';
import fs from 'fs';

export default function mainApp (state, action) {
    switch (action.type) {
        case 'ADD_SAVE':
            let appSaveData = state.get('appSaveData');
            if (!appSaveData.cemuSavePath) {
                appSaveData.cemuSavePath = [action.cemuSavePath];
            } else {
                let ar = appSaveData.cemuSavePath;
                ar.push(action.cemuSavePath);
                appSaveData.cemuSavePath = ar;
            }
            fs.writeFileSync(state.get('appSavePath'), JSON.stringify(appSaveData));
            state = state.set('appSaveData', appSaveData);
            state = state.set('cemuSave', action.cemuSave);
            return state;
        case 'LOAD_SAVE':
            state = state.set('cemuSave', action.cemuSave);
            return state;
        case 'SMMDB_RESULT':
            state = state.set('smmdb', action.courses);
            return state;
        default:
            let save = remote.getGlobal('save');
            console.log(save);
            return Map(save);

    }
};