import { fromJS, List, Map } from 'immutable';
import { remote } from 'electron';

import fs from 'fs';
import path from 'path';

export default function mainApp (state, action) {
    let appSaveData, cemuSavePath, currentDownload, currentDownloads, downloads, addedToSave;
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
        case 'START_DOWNLOAD_COURSE':
            currentDownloads = state.get('currentDownloads');
            if (!currentDownloads) {
                currentDownloads = Map();
            }
            currentDownloads = currentDownloads.set(+action.courseId, List([0,action.dataLength]));
            state = state.set('currentDownloads', currentDownloads);
            return state;
        case 'PROGRESS_DOWNLOAD_COURSE':
            currentDownloads = state.get('currentDownloads');
            currentDownload = currentDownloads.get(+action.courseId);
            currentDownload = currentDownload.set(0, currentDownload.get(0) + action.dataLength);
            currentDownloads = currentDownloads.set(+action.courseId, currentDownload);
            state = state.set('currentDownloads', currentDownloads);
            return state;
        case 'FINISH_DOWNLOAD_COURSE':
            currentDownloads = state.get('currentDownloads');
            currentDownload = currentDownloads.get(+action.courseId);
            currentDownload = currentDownload.set(0, currentDownload.get(1));
            currentDownloads = currentDownloads.set(+action.courseId, currentDownload);
            state = state.set('currentDownloads', currentDownloads);
            downloads = state.get('downloads');
            if (!downloads) {
                downloads = List();
            }
            downloads = downloads.push(action.courseId);
            state = state.set('downloads', downloads);
            return state;
        case 'FINISH_ADD_COURSE':
            addedToSave = state.get('addedToSave');
            if (!addedToSave) {
                addedToSave = List();
            }
            addedToSave = addedToSave.push(action.courseId);
            state = state.set('addedToSave', addedToSave);
            state = state.set('cemuSave', action.cemuSave);
            return state;
        case 'FINISH_DELETE_COURSE':
            if (state.has('cemuSave')) {
                state = state.delete('cemuSave');
            }
            state = state.set('cemuSave', action.cemuSave);
            return state;
        case '@@redux/INIT':
            let save = remote.getGlobal('save');
            return fromJS(save);

    }
    return state;
};