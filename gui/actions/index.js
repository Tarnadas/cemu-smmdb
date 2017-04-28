const setSavePath = (savePath) => {
    //console.log("action: " + savePath);
    return {
        type: 'SET_SAVE_PATH',
        savePath
    }
};

export default setSavePath;