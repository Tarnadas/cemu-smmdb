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
    return {
        type: 'DOWNLOAD_COURSE',
        courseId,
        courseName,
        ownerName
    }
}

export function startDownloadCourse (courseId, dataLength) {
    return {
        type: 'START_DOWNLOAD_COURSE',
        courseId,
        dataLength
    }
}

export function progressDownloadCourse (courseId, dataLength) {
    return {
        type: 'PROGRESS_DOWNLOAD_COURSE',
        courseId,
        dataLength
    }
}

export function finishDownloadCourse (courseId) {
    return {
        type: 'FINISH_DOWNLOAD_COURSE',
        courseId
    }
}