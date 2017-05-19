import { fromJS, List, Map } from 'immutable';
import { remote } from 'electron';

import fs from 'fs';
import path from 'path';

export default function mainApp (state, action) {
    let appSaveData, cemuSavePath, currentDownloads, downloads, addedToSave;
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
            state = state.set('appSaveData', appSaveData);
            state = state.set('cemuSave', action.cemuSave);
            state = state.set('currentSave', '' + (cemuSavePath.size - 1));
            saveState(state);
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
            state = state.set('appSaveData', appSaveData);
            saveState(state);
            return state;
        case 'LOAD_SAVE':
            state = state.set('cemuSave', action.cemuSave);
            state = state.set('currentSave', ''+action.saveId);
            return state;
        case 'ADD_API_KEY':
            appSaveData = state.get('appSaveData').set('apiKey', action.apiKey);
            state = state.set('appSaveData', appSaveData);
            saveState(state);
            return state;
        case 'SMMDB_RESULT':
            state = state.set('smmdb', action.smmdb);
            return state;
        case 'START_DOWNLOAD_COURSE':
            state = state.setIn(['currentDownloads', action.courseId], List([0,action.dataLength]));
            return state;
        case 'PROGRESS_DOWNLOAD_COURSE':
            state = state.setIn(['currentDownloads', action.courseId, '0'], state.getIn(['currentDownloads', action.courseId, '0']) + action.dataLength);
            return state;
        case 'FINISH_DOWNLOAD_COURSE':
            state = state.setIn(['currentDownloads', action.course.smmdbId, '0'], state.getIn(['currentDownloads', action.course.smmdbId, '1']));
            state = state.setIn(['appSaveData', 'downloads', ''+action.course.smmdbId], Map(action.course));
            saveState(state);
            return state;
        case 'FINISH_ADD_COURSE':
            if (state.getIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'smmdb', ''+action.smmdbId, 'addedToSave'])) {
                return state;
            }
            state = state.setIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'smmdb', ''+action.smmdbId, 'addedToSave'], true);
            state = state.setIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'save', ''+action.saveId, 'smmdbId'], action.smmdbId);
            saveState(state);
            return state;
        case 'FINISH_ADD_PACKAGE_COURSE':
            if (state.getIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'smmdb', ''+action.smmdbId, ''+action.courseId, 'addedToSave'])) {
                return state;
            }
            state = state.setIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'smmdb', ''+action.smmdbId, ''+action.courseId, 'addedToSave'], true);
            state = state.setIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'save', ''+action.saveId, 'smmdbId'], action.smmdbId);
            state = state.setIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'save', ''+action.saveId, 'courseId'], action.courseId);
            saveState(state);
            return state;
        case 'FINISH_DELETE_COURSE':
            if (state.has('cemuSave')) {
                state = state.delete('cemuSave');
            }
            state = state.set('cemuSave', action.cemuSave);
            state = state.deleteIn(['courseSaveData', ''+action.saveId]);
            if (!!action.smmdbId) {
                state = state.setIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'smmdb', ''+action.smmdbId, 'addedToSave'], false);
            }
            state = state.deleteIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'save', ''+action.saveId]);
            saveState(state);
            return state;
        case 'FINISH_DELETE_PACKAGE_COURSE':
            if (state.has('cemuSave')) {
                state = state.delete('cemuSave');
            }
            state = state.set('cemuSave', action.cemuSave);
            state = state.deleteIn(['courseSaveData', ''+action.saveId]);
            if (!!action.smmdbId) {
                state = state.setIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'smmdb', ''+action.smmdbId, ''+action.courseId, 'addedToSave'], false);
            }
            state = state.deleteIn(['appSaveData', 'cemuSaveData', state.get('currentSave'), 'save', ''+action.saveId]);
            saveState(state);
            return state;
        case 'FINISH_OPEN_PACKAGE':
            state = state.set('currentPackage', action.coursePackage);
            return state;
        case 'CLOSE_PACKAGE':
            state = state.delete('currentPackage');
            return state;
        case '@@redux/INIT':
            let save = remote.getGlobal('save');
            return fromJS(save);

    }
    return state;
};

function saveState (state) {
    fs.writeFileSync(path.join(state.get('appSavePath'), 'save.json'), JSON.stringify(state.get('appSaveData'), null, 2));
}

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};