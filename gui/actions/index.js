export function addSave (cemuSavePath, cemuSave) {
    return {
        type: 'ADD_SAVE',
        cemuSavePath,
        cemuSave
    }
}

export function removeSave (cemuSavePath) {
    return {
        type: 'REMOVE_SAVE',
        cemuSavePath
    }
}

export function loadSave (cemuSave) {
    return {
        type: 'LOAD_SAVE',
        cemuSave
    }
}

export function smmdbResult (smmdb) {
    return {
        type: 'SMMDB_RESULT',
        smmdb
    }
}

export function downloadCourse (courseId, courseName, ownerName) {
    "use strict";
    return {
        type: 'DOWNLOAD_COURSE',
        courseId,
        courseName,
        ownerName
    }
}