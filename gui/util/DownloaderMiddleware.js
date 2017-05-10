import { startDownloadCourse, progressDownloadCourse, finishDownloadCourse, finishAddCourse, finishDeleteCourse } from '../actions';

export default function downloaderMiddleware (courseDownloader) {
    return ({ dispatch, getState }) => next => action => {
        let onStart = (courseId, dataLength) => {
            dispatch(startDownloadCourse(courseId, dataLength));
        };
        let onProgress = (courseId, dataLength) => {
            dispatch(progressDownloadCourse(courseId, dataLength));
        };
        let onFinish = (courseId) => {
            dispatch(finishDownloadCourse(courseId));
        };
        let onAddFinish = (cemuSave, courseId, success) => {
            dispatch(finishAddCourse(cemuSave, courseId, success));
        };
        let onDeleteFinish = (cemuSave, courseId, success) => {
            dispatch(finishDeleteCourse(cemuSave, courseId, success));
        };
        switch (action.type) {
            case 'DOWNLOAD_COURSE':
                courseDownloader.download(onStart, onProgress, onFinish, action.courseId, action.courseName, action.ownerName, action.videoId);
                break;
            case 'ADD_COURSE':
                courseDownloader.add(onAddFinish, action.courseId);
                break;
            case 'DELETE_COURSE':
                courseDownloader.delete(onDeleteFinish, action.courseId);
                break;
        }
        return next(action);
    }
}