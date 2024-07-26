let currentSong = new Audio();
let songs;
let currFolder;
function formatTime(seconds) {
    // Calculate the minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad the minutes and seconds with leading zeros if necessary
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${paddedMinutes}:${paddedSeconds}`;
}

// Example usage
const timeInSeconds1 = 3.60415;
const timeInSeconds2 = 289.410612000000015;

console.log(formatTime(timeInSeconds1)); // Output: "00:03"
console.log(formatTime(timeInSeconds2)); // Output: "04:49"


// Example usage
const timeInSeconds = 12;
console.log(formatTime(timeInSeconds)); // Output: "00:12"

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML + ` <li>
                            <img class="invert" src="music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="play">
                            </div>
                        </li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });
    return songs;
}
getSongs();
const playMusic = (track, pause = false) => {
    // let audio= new Audio("/songs/"+track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg"
    }
    // currentSong.src="/songs/"+track;
    // currentSong.play();
    // play.src="pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "0:0 / 0:0";
}
// async function displayAlbums() {
//     let a = await fetch(`http://127.0.0.1:5500/songs/`);
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a");
//     let cardContainer = document.querySelector(".cardContainer")
//     let folders = [];
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];


//         if (e.href.includes("/songs")) {
//             let folder = e.href.split("/").slice(-1)[0]
//             let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//             let response = await a.json();
//             console.log(response)
//             cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="cs" class="card">
//                         <div class="play">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="#000000">
//                                 <path
//                                     d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
//                                     fill="#000" stroke-width="1.5" stroke-linejoin="round" />
//                             </svg>
//                         </div>
//                         <img src="/songs/${folder}/cover.jpeg" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`
//         }
//     }
//     Array.from(document.getElementsByClassName("card")).forEach(e => {
//         e.addEventListener("click", async item => {
//             songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

//         })
//     })
// }





async function displayAlbums() {
    try {
        let a = await fetch(`http://127.0.0.1:5500/songs/`);
        if (!a.ok) {
            throw new Error(`Network response was not ok: ${a.statusText}`);
        }

        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");
        let folders = [];
        let array = Array.from(anchors);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];

            if (e.href.includes("/songs")) {
                let folder = e.href.split("/").slice(-1)[0];

                try {
                    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                    if (!a.ok) {
                        throw new Error(`Network response was not ok: ${a.statusText}`);
                    }
                    let response = await a.json();
                    console.log(response);
                    cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="#000000">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
                } catch (jsonError) {
                    console.error(`Failed to fetch or parse JSON for folder ${folder}:`, jsonError);
                }
            }
        }

        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                let songs;
                try {
                    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                } catch (songError) {
                    console.error(`Failed to get songs for folder ${item.currentTarget.dataset.folder}:`, songError);
                }
            });
        });
    } catch (error) {
        console.error('Failed to fetch or process songs:', error);
    }
}

async function main() {

    songs = await getSongs("songs/ncs");
    playMusic(songs[0], true);
    displayAlbums();
    // console.log(songs);
    // let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    // for (const song of songs) {

    //     songUL.innerHTML=songUL.innerHTML+` <li>
    //                         <img class="invert" src="music.svg" alt="music">
    //                         <div class="info">
    //                             <div>${song.replaceAll("%20", " ")}</div>
    //                             <div>Sidboy</div>
    //                         </div>
    //                         <div class="playnow">
    //                             <span>Play Now</span>
    //                             <img class="invert" src="play.svg" alt="play">
    //                         </div>
    //                     </li>`;
    // }
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element=>{
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML);
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    //     })
    // });
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-" + "120" + "%";
    })
    previous.addEventListener("click", () => {
        console.log("Previous is clicked")
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("Next is clicked")
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if ((index + 1) < (songs.length)) {
            playMusic(songs[index + 1]);
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e)
        currentSong.volume = parseInt(e.target.value) / 100;
    })
    // Array.from(document.getElementsByClassName("card")).forEach(e=>{
    //     e.addEventListener("click",async item=>{
    //         songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`);

    //     })
    // })
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg");
            currentSong.volume="0";
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume=".10";
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })
}
main();