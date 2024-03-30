
let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers: [
        {
            urls: ["stun:stun.l.google.com:19302","stun:stun2.l.google.com:19302"]
        }
    ]
}

async function init(){
    localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
    document.getElementById("user-1").srcObject = localStream;
    
    createOffer()
}

async function createOffer(){
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;

    localStream.getTracks().forEach((track)=>{
        peerConnection.addTrack(track,localStream);
    });

    peerConnection.ontrack = (event) =>{
        event.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track);
        })
    }

    peerConnection.onicecandidate = async(event)=>{
        if(event.candidate){
            console.log("New ICE candidate", event.candidate);
        }
    };

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("offer:",offer)
}

init()