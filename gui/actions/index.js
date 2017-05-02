const setSave = (cemuSavePath, cemuSave) => {
    return {
        type: 'SET_SAVE',
        cemuSavePath,
        cemuSave
    }
};

export default setSave;