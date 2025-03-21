import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { LoaderCircle, Upload, FileUp, CheckCircle, File } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    workSummery: '',
    certificate: {
        fileUrl: null,
        fileName: null,
        uploaded: false
    }
};

function Experience() {
    const [experinceList, setExperinceList] = useState([]);
    const params = useParams();
    const { getToken } = useAuth();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);
    const [uploadingCertificate, setUploadingCertificate] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentExperienceIndex, setCurrentExperienceIndex] = useState(null);

    // Derived certificate state (only change)
    const certificateUploaded = experinceList.length === 0 || 
        experinceList.some(exp => exp.certificate?.uploaded);

    useEffect(() => {
        const fetchResumeData = async () => {
            setLoading(true);
            try {
                const id = params?.resumeId;
                const token = await getToken();
                const response = await axios.get(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                const fetchedData = response.data?.data;
                if (fetchedData.Experience && Array.isArray(fetchedData.Experience)) {
                    setExperinceList(fetchedData.Experience);
                } else {
                    setExperinceList([]);
                }
                setResumeInfo(fetchedData);
            } catch (error) {
                console.error('Error fetching resume data:', error);
                toast.error("Failed to fetch resume details");
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [params, getToken, setResumeInfo]);

    // Rest of the functions remain exactly the same
    const handleChange = (index, event) => {
        const newEntries = experinceList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperinceList(newEntries);
    };

    const openCertificateDialog = async (index) => {
        setLoading(true);
        try {
            const experienceToSave = Array.isArray(experinceList) ? experinceList : [];
            const data = {
                data: { Experience: experienceToSave }
            };

            const id = params?.resumeId;
            const token = await getToken();
            
            await axios.put(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setCurrentExperienceIndex(index);
            setSelectedFile(null);
            setDialogOpen(true);
        } catch (error) {
            console.error('Error saving experience:', error);
            toast.error("Failed to save experience. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a PDF or image file (JPEG, PNG)');
                return;
            }
            setSelectedFile(file);
        }
    };

    const uploadCertificate = async () => {
        if (!selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }
        
        setUploadingCertificate(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('resumeId', params.resumeId);
            formData.append('experienceIndex', currentExperienceIndex.toString());
            
            const token = await getToken();
            const response = await axios.post(
                'https://hirely-78iq.onrender.com/api/certificates/experience',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                const newEntries = [...experinceList];
                newEntries[currentExperienceIndex] = {
                    ...newEntries[currentExperienceIndex],
                    certificate: response.data.certificate
                };
                setExperinceList(newEntries);
                toast.success('Certificate uploaded successfully');
                setDialogOpen(false);
            }
        } catch (error) {
            console.error('Certificate upload error:', error);
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploadingCertificate(false);
        }
    };

    const AddNewExperience = () => {
        setExperinceList([...experinceList, { ...formField }]);
    };

    const RemoveExperience = () => {
        setExperinceList(prev => prev.slice(0, -1));
    };

    const handleRichTextEditor = (e, name, index) => {
        const newEntries = experinceList.slice();
        newEntries[index][name] = e.target.value;
        setExperinceList(newEntries);
    };

    // Modified save validation
    const onSave = async () => {
        if (experinceList.length > 0 && !certificateUploaded) {
            toast.error("Please upload at least one certificate before saving");
            return;
        }

        setLoading(true);
        try {
            const id = params?.resumeId;
            const token = await getToken();
            await axios.put(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, {
                data: { Experience: experinceList }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Experience details updated successfully");
        } catch (error) {
            console.error('Error updating resume:', error);
            toast.error("Failed to update details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setResumeInfo(prevInfo => ({
            ...prevInfo,
            Experience: experinceList
        }));
    }, [experinceList, setResumeInfo]);

    // JSX remains exactly the same as original
    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Professional Experience</h2>
                <p>Add Your previous Job experience</p>
                <div>
                    {experinceList.map((item, index) => (
                        <div key={index}>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                                <div>
                                    <label className='text-xs'>Position Title</label>
                                    <Input name="title"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.title}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>Company Name</label>
                                    <Input name="companyName"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.companyName} />
                                </div>
                                <div>
                                    <label className='text-xs'>City</label>
                                    <Input name="city"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.city} />
                                </div>
                                <div>
                                    <label className='text-xs'>State</label>
                                    <Input name="state"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.state}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>Start Date</label>
                                    <Input type="date"
                                        name="startDate"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.startDate} />
                                </div>
                                <div>
                                    <label className='text-xs'>End Date</label>
                                    <Input type="date" name="endDate"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.endDate}
                                    />
                                </div>
                                <div className='col-span-1 sm:col-span-2'>
                                    <RichTextEditor
                                        index={index}
                                        defaultValue={item?.workSummery}
                                        onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummery', index)} />
                                </div>
                                <div className='col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t pt-3'>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                                        <Button
                                            type="button"
                                            variant={item?.certificate?.uploaded ? "secondary" : "outline"}
                                            onClick={() => openCertificateDialog(index)}
                                            className="flex items-center gap-2 w-full sm:w-auto"
                                        >
                                            <FileUp className="w-4 h-4" />
                                            {item?.certificate?.uploaded ? 'Update Certificate' : 'Upload Certificate'}
                                        </Button>
                                        
                                        {item?.certificate?.uploaded && (
                                            <div className="flex items-center gap-2 text-green-600 mt-2 sm:mt-0">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm truncate max-w-[200px]">{item.certificate.fileName || 'Certificate uploaded'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex flex-col sm:flex-row justify-between gap-2'>
                    <div className='flex flex-col sm:flex-row gap-2'>
                        <Button variant="outline" onClick={AddNewExperience} className="text-primary w-full sm:w-auto"> + Add More Experience</Button>
                        <Button variant="outline" onClick={RemoveExperience} className="text-primary w-full sm:w-auto"> - Remove</Button>
                    </div>
                    <Button 
                        disabled={loading || (experinceList.length > 0 && !certificateUploaded)} 
                        onClick={() => onSave()}
                        className={`mt-2 sm:mt-0 w-full sm:w-auto ${experinceList.length > 0 && !certificateUploaded ? "opacity-50 bg-gray-300 cursor-not-allowed" : ""}`}
                    >
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
                {experinceList.length > 0 && !certificateUploaded && (
                    <p className="text-xs text-amber-600 mt-2 text-right">Upload a certificate to enable saving</p>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload Certificate</DialogTitle>
                        <DialogDescription>
                            Upload a certificate or proof of experience for verification
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-4 py-4">
                        <div 
                            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all duration-300 ${
                                selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                            onClick={() => document.getElementById('certificate-file-input').click()}
                        >
                            {selectedFile ? (
                                <div className="flex flex-col items-center">
                                    <File className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mb-1 sm:mb-2" />
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 break-all">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <Button
                                        variant="link"
                                        className="mt-1 p-0 h-auto text-xs text-blue-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-1 sm:mb-2" />
                                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                                        Click to upload certificate
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                                        Supports PDF, JPEG, PNG (Max 5MB)
                                    </p>
                                </div>
                            )}
                            <input
                                id="certificate-file-input"
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            className="w-full sm:w-auto order-2 sm:order-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={!selectedFile || uploadingCertificate}
                            onClick={uploadCertificate}
                            className="w-full sm:w-auto order-1 sm:order-2"
                        >
                            {uploadingCertificate ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload Certificate'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Experience