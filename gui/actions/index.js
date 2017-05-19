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

export function loadSave (cemuSave, saveId) {
    return {
        type: 'LOAD_SAVE',
        cemuSave,
        saveId
    }
}

export function smmdbResult (smmdb) {
    return {
        type: 'SMMDB_RESULT',
        smmdb
    }
}

export function addApiKey (apiKey) {
    return {
        type: 'ADD_API_KEY',
        apiKey
    }
}

export function openPackage (packageId) {
    return {
        type: 'OPEN_PACKAGE',
        packageId
    }
}

export function finishOpenPackage (coursePackage) {
    return {
        type: 'FINISH_OPEN_PACKAGE',
        coursePackage
    }
}

export function closePackage () {
    return {
        type: 'CLOSE_PACKAGE'
    }
}

export function downloadCourse (courseId, courseName, ownerName, videoId, courseType) {
    return {
        type: 'DOWNLOAD_COURSE',
        courseId,
        courseName,
        ownerName,
        videoId,
        courseType
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

export function finishDownloadCourse (course) {
    return {
        type: 'FINISH_DOWNLOAD_COURSE',
        course
    }
}

export function addCourse (courseId, packageId) {
    return {
        type: 'ADD_COURSE',
        courseId,
        packageId
    }
}

export function finishAddCourse (cemuSave, smmdbId, saveId, success) {
    return {
        type: 'FINISH_ADD_COURSE',
        cemuSave,
        smmdbId,
        saveId,
        success
    }
}

export function finishAddPackageCourse (cemuSave, courseId, smmdbId, saveId, success) {
    return {
        type: 'FINISH_ADD_PACKAGE_COURSE',
        cemuSave,
        courseId,
        smmdbId,
        saveId,
        success
    }
}

export function deleteCourse (smmdbId, courseId, saveId) {
    return {
        type: 'DELETE_COURSE',
        smmdbId,
        courseId,
        saveId
    }
}

export function finishDeleteCourse (cemuSave, smmdbId, saveId, success) {
    return {
        type: 'FINISH_DELETE_COURSE',
        cemuSave,
        smmdbId,
        saveId,
        success
    }
}

export function finishDeletePackageCourse (cemuSave, smmdbId, courseId, saveId, success) {
    return {
        type: 'FINISH_DELETE_PACKAGE_COURSE',
        cemuSave,
        smmdbId,
        courseId,
        saveId,
        success
    }
}