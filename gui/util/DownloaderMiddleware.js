import { startDownloadCourse, progressDownloadCourse, finishDownloadCourse } from '../actions';

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
        switch (action.type) {
            case 'DOWNLOAD_COURSE':
                courseDownloader.download(onStart, onProgress, onFinish, action.courseId, action.courseName, action.ownerName, getState().get('appSavePath'));
                break;
        }
        return next(action);
    }
}