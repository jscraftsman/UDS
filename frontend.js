/* jshint esversion: 6 */

const VERSION = 'v1.0.0';
const SERVER_URL = 'http://localhost:3000/extract';

const DOWNLOAD_VIDEO_UI = '' +
'<div style="position: absolute; right: 0; z-index: 9999;">' + 
'    <button href="#" class="download" style="height: 3em;">Download</button>' +
'</div>' +
'';

$(() => {
    console.log('Adding Udemy downloader script...');

    $('body').prepend(DOWNLOAD_VIDEO_UI);

    $('body').on('click', 'button.download', DownloadVideo);

    function DownloadVideo(e) {
        e.preventDefault();

        let order = $(".course-info__section").first().text().trim();
        let title = $(".course-info__title").first().text().trim();
        let url = $(".vjs-tech").first().attr("src").trim();

        let payload = {
            'order': order,
            'title': title,
            'url': url
        };

        console.log('[START] Downloading video: ' + title);
        $.post(SERVER_URL, payload).done((data) => {
            console.log('[DONE] Downloaded video: ' + title);
        }).fail((err) => {
            console.log('[DONE] Failed to download video: ' + title);
        });
    }
});