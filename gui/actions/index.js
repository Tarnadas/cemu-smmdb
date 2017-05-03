export function addSave(cemuSavePath, cemuSave) {
    return {
        type: 'ADD_SAVE',
        cemuSavePath,
        cemuSave
    }
}

export function loadSave(cemuSave) {
    return {
        type: 'LOAD_SAVE',
        cemuSave
    }
}