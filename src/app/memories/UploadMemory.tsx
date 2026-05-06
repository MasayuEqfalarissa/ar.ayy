"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Upload, Camera, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadMemory() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const router = useRouter();

  // Clean up camera on unmount or close
  useEffect(() => {
    if (!isOpen || !isRecordingMode) {
      stopCamera();
    }
  }, [isOpen, isRecordingMode]);

  const startCamera = async () => {
    setIsRecordingMode(true);
    setRecordedBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Could not access camera. Please check permissions.");
      setIsRecordingMode(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      stopCamera();
    };

    mediaRecorder.start();
    setIsRecording(true);
    
    // 3 seconds countdown
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev && prev > 1) return prev - 1;
        clearInterval(interval);
        return null;
      });
    }, 1000);

    setTimeout(() => {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    // If we recorded a live photo, override the file input
    if (recordedBlob) {
      formData.set("file", recordedBlob, "livephoto.webm");
    }
    
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        setIsOpen(false);
        setRecordedBlob(null);
        setIsRecordingMode(false);
        router.refresh(); // Refresh server component data
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-200 transition-transform hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-rose-50">
              <h2 className="text-xl font-bold text-slate-800">Add New Memory</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" name="title" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="e.g. Anniversary Dinner" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input required type="date" name="date" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea name="description" rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="How was it?"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Photo/Video</label>
                
                {isRecordingMode ? (
                  <div className="border-2 border-slate-200 rounded-xl p-2 bg-slate-900 text-center relative overflow-hidden h-64 flex flex-col justify-center items-center">
                    {!recordedBlob ? (
                      <>
                        <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80"></video>
                        {countdown !== null ? (
                          <div className="relative z-10 text-white text-6xl font-black drop-shadow-lg animate-ping">{countdown}</div>
                        ) : (
                          <button 
                            type="button" 
                            onClick={startRecording}
                            disabled={isRecording}
                            className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center p-1"
                          >
                            <div className="w-full h-full bg-rose-500 rounded-full flex items-center justify-center">
                              <Camera className="w-6 h-6 text-white" />
                            </div>
                          </button>
                        )}
                        <button type="button" onClick={() => setIsRecordingMode(false)} className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1"><X className="w-4 h-4"/></button>
                      </>
                    ) : (
                      <>
                        <video src={URL.createObjectURL(recordedBlob)} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover"></video>
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                          <button type="button" onClick={startCamera} className="bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">Retake</button>
                          <button type="button" onClick={() => setIsRecordingMode(false)} className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">Cancel</button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1 border-2 border-dashed border-rose-200 rounded-xl p-4 text-center hover:bg-rose-50 transition-colors relative cursor-pointer group">
                      <input type="file" name="file" accept="image/*,video/*" required={!recordedBlob} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-rose-300 mb-1 group-hover:text-rose-500 transition-colors" />
                        <span className="text-xs text-slate-500 font-medium">Upload File</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={startCamera}
                      className="flex-1 border-2 border-rose-100 bg-rose-50 text-rose-600 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-rose-100 transition-colors"
                    >
                      <Video className="w-6 h-6 mb-1" />
                      <span className="text-xs font-bold">Take Live Photo</span>
                    </button>
                  </div>
                )}
              </div>

              <button disabled={loading} type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 flex justify-center items-center">
                {loading ? "Uploading..." : "Save Memory"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
