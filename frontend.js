/* jshint esversion: 6 */

const VERSION = 'v1.0.0';
const SERVER_URL = 'http://localhost:3000/extract';
const DB_KEY = 'ud-download-active';

const BUTTON_STR = {
    START: 'Start Download',
    STOP: 'Stop Download'
}

const DOWNLOAD_VIDEO_UI = '' +
'<div style="position: absolute; right: 0; z-index: 9999;">' + 
'    <button href="#" id="ud-downloader" style="height: 3em;">' + BUTTON_STR.START + '</button>' +
'</div>' +
'';

$(() => {
    console.log('Adding Udemy downloader script...');

    $('body').prepend(DOWNLOAD_VIDEO_UI);
    $('body').on('click', 'button#ud-downloader', ToggleDownloadVideo);

    function ToggleDownloadVideo(e) {
        e.preventDefault();

        if($('button#ud-downloader').text() === BUTTON_STR.START) {
            localStorage[DB_KEY] = true;
            StartDownload();
        } else {
            StopDownload();
        }
    }

    function StartDownload() {
        console.log('STARTING UDEMY DOWNLOADER');
        $(".vjs-tech")[0].pause();

        let payload = createPayload();

        if(payload && payload.url && localStorage[DB_KEY]) {
            $('button#ud-downloader').text(BUTTON_STR.STOP);
            HandleDownload(payload);
        } else {
            delete localStorage[DB_KEY];
            console.log('No URL for ' + payload.title);
        }
    }

    function StopDownload() {
        $('button#ud-downloader').text(BUTTON_STR.START);
        console.log('STOPPING UDEMY DOWNLOADER');
        delete localStorage[DB_KEY];
    }

    function createPayload() {
        let order = $(".course-info__section").first().text().trim();
        let title = $(".course-info__title").first().text().trim();
        let url = $(".vjs-tech").first().attr("src").trim();

        return {
            'order': order,
            'title': title,
            'url': url
        };
    }

    function HandleDownload(payload) {
        console.log('[START] Downloading video: ' + payload.title);
        $.post(SERVER_URL, payload).done((data) => {
            console.log('[DONE] Downloaded video: ' + payload.title);
            $("button.continue-button").first().click();
            setTimeout(StartDownload, 5000);
        }).fail((err) => {
            console.log('[ERROR] Failed to download video: ' + payload.title);
            StopDownload();
        });
    }

});