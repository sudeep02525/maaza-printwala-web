'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';
import { useConfiguratorStore } from '../../store/configuratorStore.js';
import Button from '../ui/Button.jsx';
import Alert from '../ui/Alert.jsx';

export default function ArtworkUploader({ product, onCloseModal }) {
  const { setDesignReady } = useConfiguratorStore();

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedResult, setUploadedResult] = useState(null);

  const reqs = product?.artworkRequirements || {
    allowedFormats: ['PDF', 'PNG', 'JPG', 'AI', 'EPS', 'WEBP', 'TIFF'],
    maxSizeMB: 25,
    guidance: 'Ensure text is inside the safety margin and fonts are embedded or outlined.',
  };

  const allowedList = Array.isArray(reqs.allowedFormats)
    ? reqs.allowedFormats
    : ['PDF', 'PNG', 'JPG', 'AI', 'EPS', 'WEBP', 'TIFF'];
  const maxLimitMB = reqs.maxSizeMB || 25;

  const validateFile = (f) => {
    setErrorMsg('');
    const maxBytes = maxLimitMB * 1024 * 1024;
    if (f.size > maxBytes) {
      setErrorMsg(`File size exceeds ${maxLimitMB}MB limit. Please compress your artwork file.`);
      return false;
    }
    const ext = f.name.split('.').pop()?.toUpperCase() || '';
    if (!allowedList.includes(ext) && !['PDF', 'PNG', 'JPG', 'JPEG', 'AI', 'EPS', 'WEBP', 'TIFF'].includes(ext)) {
      setErrorMsg(`Invalid file format (${ext}). Supported formats: ${allowedList.join(', ')}.`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setUploadedResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(10);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('artwork', file);

      const res = await axiosInstance.post('/upload/artwork', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percent);
        },
      });

      const artworkMeta = res.data.data.artwork;
      setUploadedResult(artworkMeta);
      setUploadProgress(100);

      // Save to configuratorStore ready for future cart consumption!
      setDesignReady('UPLOAD', {
        artwork: artworkMeta,
        originalName: file.name,
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Artwork upload failed.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Artwork Requirements Banner */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-[#0082CA]" />
          <span>Artwork Submission Guidelines:</span>
        </div>
        <ul className="list-disc list-inside text-slate-600 space-y-1 font-normal pl-1">
          <li>Accepted Formats: <strong className="text-slate-900">{allowedList.join(', ')}</strong></li>
          <li>Maximum File Limit: <strong className="text-slate-900">{maxLimitMB} MB</strong> per file</li>
          <li>General Guidance: <span className="text-slate-700">{reqs.guidance || 'Keep important text and logos within safe margin boundaries.'}</span></li>
        </ul>
      </div>

      {/* Drag & Drop Box */}
      {!uploadedResult ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileSelect(e.dataTransfer.files?.[0]);
            }}
            className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all flex flex-col items-center justify-center space-y-4 ${
              isDragging
                ? 'border-[#0082CA] bg-blue-50/50 scale-[1.01]'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0082CA] border border-slate-200">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Drag and drop your print artwork file here
              </p>
              <p className="text-xs text-slate-500 mt-1">or browse files from your local drive</p>
            </div>
            <label className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all">
              Browse Artwork File
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
            </label>
          </div>

          {/* Selected File Details */}
          {file && (
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-8 h-8 text-[#0082CA] shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-400 font-normal">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-50 transition-all"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <Alert variant="error" title="Upload Error">
              {errorMsg}
            </Alert>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Uploading artwork file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0082CA] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            variant="primary"
            size="lg"
            disabled={!file || isUploading}
            onClick={handleUpload}
            className="w-full shadow-md text-sm py-3.5"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Artwork...</span>
              </>
            ) : (
              <>
                <span>Upload & Save Artwork</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      ) : (
        /* Upload Success Box */
        <div className="p-6 bg-emerald-50/80 border border-emerald-300 rounded-2xl text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-black text-emerald-950">File Uploaded Successfully</h4>
            <p className="text-xs text-emerald-800 mt-1 font-normal">
              Your artwork file has been received and is pending staff review. Storage reference: <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-emerald-900 font-bold">{uploadedResult.fileId}</code>
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUploadedResult(null);
                setFile(null);
              }}
              className="flex-1 border-emerald-300 text-emerald-900 hover:bg-emerald-100/50"
            >
              Replace Artwork File
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onCloseModal}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 shadow-xs"
            >
              <span>Continue to Summary</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
