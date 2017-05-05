import { fromJS, List } from 'immutable';
import { remote } from 'electron';

import fs from 'fs';
import path from 'path';

import CourseDownloader from '../util/CourseDownloader';

export default function mainApp (state, action) {
    let appSaveData, cemuSavePath;
    switch (action.type) {
        case 'ADD_SAVE':
            appSaveData = state.get('appSaveData');
            cemuSavePath = appSaveData.get('cemuSavePath');
            if (!cemuSavePath) {
                cemuSavePath = List([action.cemuSavePath]);
            } else {
                cemuSavePath = cemuSavePath.push(action.cemuSavePath);
            }
            appSaveData = appSaveData.set('cemuSavePath', cemuSavePath);
            fs.writeFileSync(path.join(state.get('appSavePath'), 'save.json'), JSON.stringify(appSaveData));
            state = state.set('appSaveData', appSaveData);
            state = state.set('cemuSave', action.cemuSave);
            return state;
        case 'REMOVE_SAVE':
            appSaveData = state.get('appSaveData');
            cemuSavePath = appSaveData.get('cemuSavePath');
            let index = 0;
            for (let i = 0; i < cemuSavePath.size; i++) {
                if (cemuSavePath.get(i) === action.cemuSavePath) {
                    index = i;
                    break;
                }
            }
            cemuSavePath = cemuSavePath.delete(index);
            appSaveData = appSaveData.set('cemuSavePath', cemuSavePath);
            fs.writeFileSync(path.join(state.get('appSavePath'), 'save.json'), JSON.stringify(appSaveData));
            state = state.set('appSaveData', appSaveData);
            return state;
        case 'LOAD_SAVE':
            state = state.set('cemuSave', action.cemuSave);
            return state;
        case 'SMMDB_RESULT':
            state = state.set('smmdb', action.smmdb);
            return state;
        case 'DOWNLOAD_COURSE':
            new CourseDownloader(action.courseId, action.courseName, action.ownerName, state.get('appSavePath'));
            return state;
        default:
            let save = remote.getGlobal('save');
            return fromJS(save);

    }
};