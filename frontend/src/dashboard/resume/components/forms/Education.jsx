import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle, FileUp, CheckCircle, File } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

function Education() {
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const { getToken } = useAuth(); 
  const [educationalList, setEducationalList] = useState([]); // Initialize as an empty array
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [certificateUploaded, setCertificateUploaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentEducationIndex, setCurrentEducationIndex] = useState(null);

  useEffect(() => {
    const fetchEducationData = async () => {
      setLoading(true);
      try {
        const id = params?.resumeId; // Get the resume ID from URL params
        const token = await getToken(); // Get the authorization token
        const response = await axios.get(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', response);
        const fetchedData = response.data?.data;  
        console.log('Fetched data:', fetchedData);

        // Set the educational list from fetched data
        if (fetchedData.education && Array.isArray(fetchedData.education)) {
          console.log('Setting education list:', fetchedData.education);
          setEducationalList(fetchedData.education);
          
          // Check if any education has certificates uploaded
          const hasCertificates = fetchedData.education.some(edu => 
            edu.certificate && edu.certificate.uploaded);
          setCertificateUploaded(hasCertificates);
        } else {
          // Initialize with empty array if no education data
          console.log('No education data found, initializing empty array');
          setEducationalList([]);
        }

        // For an empty or new resume, we don't need certificate verification
        if (!fetchedData.education || fetchedData.education.length === 0) {
          console.log('New or empty resume, setting certificateUploaded to true');
          setCertificateUploaded(true);
        }

        // Optionally set the resumeInfo context
        setResumeInfo(fetchedData);
      } catch (error) {
        console.error('Error fetching education data:', error);
        toast.error("Failed to fetch education details");
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, [params, getToken, setResumeInfo]); // Dependencies include params and getToken

  const handleChange = (event, index) => {
    const newEntries = educationalList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
  };

  const openCertificateDialog = async (index) => {
    // First save the education data to ensure the entry exists in the database
    setLoading(true);
    try {
      // Make sure we're sending a valid array
      const educationToSave = Array.isArray(educationalList) ? educationalList : [];
      
      const data = {
        data: {
          education: educationToSave.map(({ id, ...rest }) => rest) // Exclude id if present
        }
      };

      console.log('Saving education data before certificate upload:', data);

      const id = params?.resumeId;
      if (!id) {
        throw new Error('Resume ID is missing');
      }
      
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      // Proceed directly to opening the dialog without saving first
      // This bypasses the potential issue with saving
      setCurrentEducationIndex(index);
      setSelectedFile(null);
      setDialogOpen(true);
      
      // Try to save in the background
      axios.put(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log('Education saved successfully:', response.data);
      })
      .catch(error => {
        console.error('Background save error (non-blocking):', error);
        // Non-blocking error - we'll continue with upload anyway
      });
    } catch (error) {
      console.error('Error in openCertificateDialog:', error);
      toast.error("Failed to prepare for certificate upload: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
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
      formData.append('educationIndex', currentEducationIndex.toString());
      
      console.log('Uploading certificate:', {
        resumeId: params.resumeId,
        educationIndex: currentEducationIndex,
        fileName: selectedFile.name
      });
      
      const token = await getToken();
      
      // Use our education certificate endpoint
      const response = await axios.post(
        'https://hirely-78iq.onrender.com/api/certificates/education',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Certificate upload response:', response.data);
      
      if (response.data.success) {
        // Update the education entry with certificate info from the server
        const newEntries = [...educationalList];
        
        // Make sure the current education entry exists
        if (!newEntries[currentEducationIndex]) {
          newEntries[currentEducationIndex] = {
            universityName: '',
            degree: '',
            major: '',
            startDate: '',
            endDate: '',
            description: '',
          };
        }
        
        newEntries[currentEducationIndex] = {
          ...newEntries[currentEducationIndex],
          certificate: response.data.certificate
        };
        
        setEducationalList(newEntries);
        setCertificateUploaded(true);
        toast.success('Certificate uploaded successfully');
        setDialogOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to upload certificate');
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      
      // Detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        toast.error(`Upload failed: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        toast.error(`Upload error: ${error.message}`);
      }
    } finally {
      setUploadingCertificate(false);
    }
  };

  const AddNewEducation = () => {
    setEducationalList([...educationalList, {
      universityName: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: '',
      certificate: {
        fileUrl: null,
        fileName: null,
        uploaded: false
      }
    }]);
  };

  const RemoveEducation = () => {
    setEducationalList((educationalList) => educationalList.slice(0, -1));
  };

  const onSave = async () => {
    // Make sure we're sending a valid array
    const educationToSave = Array.isArray(educationalList) ? educationalList : [];
    
    // Only require certificate if there are education entries and certificate upload is not enabled
    if (educationToSave.length > 0 && !certificateUploaded) {
      toast.error("Please upload a certificate before saving");
      return;
    }

    setLoading(true);
    const data = {
      data: {
        education: educationToSave.map(({ id, ...rest }) => rest) // Exclude id if present
      }
    };

    console.log('Saving education data:', data);

    try {
      const id = params?.resumeId;
      const token = await getToken();
      const response = await axios.put(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Save response:', response);
      toast.success("Education details updated successfully");
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error("Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update resumeInfo only when educationalList changes
    setResumeInfo(prevInfo => ({
      ...prevInfo,
      education: educationalList
    }));
  }, [educationalList, setResumeInfo]); 

  return (
    <div className='p-4 sm:p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add Your educational details</p>

      <div>
        {Array.isArray(educationalList) && educationalList.map((item, index) => (
          <div key={index}>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
              <div className='col-span-1 sm:col-span-2'>
                <label className="text-xs">University Name</label>
                <Input name="universityName"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.universityName}
                />
              </div>
              <div>
                <label className="text-xs">Degree</label>
                <Input name="degree"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.degree}
                />
              </div>
              <div>
                <label className="text-xs">Major</label>
                <Input name="major"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.major}
                />
              </div>
              <div>
                <label className="text-xs">Start Date</label>
                <Input type="date" name="startDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.startDate}
                />
              </div>
              <div>
                <label className="text-xs">End Date</label>
                <Input type="date" name="endDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.endDate}
                />
              </div>
              <div className='col-span-1 sm:col-span-2'>
                <label className="text-xs">Description</label>
                <Textarea name="description"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.description}
                />
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
          <Button variant="outline" onClick={AddNewEducation} className="text-primary w-full sm:w-auto"> + Add More Education</Button>
          <Button variant="outline" onClick={RemoveEducation} className="text-primary w-full sm:w-auto"> - Remove</Button>
        </div>
        <Button 
          disabled={loading || (educationalList.length > 0 && !certificateUploaded)} 
          onClick={() => onSave()}
          className={`w-full sm:w-auto mt-2 sm:mt-0 ${educationalList.length > 0 && !certificateUploaded ? "opacity-50 bg-gray-300 cursor-not-allowed" : ""}`}
        >
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
      {educationalList.length > 0 && !certificateUploaded && (
        <p className="text-xs text-amber-600 mt-2 text-right">Upload a certificate to enable saving</p>
      )}

      {/* Certificate Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Certificate</DialogTitle>
            <DialogDescription>
              Upload a certificate or proof of education for verification
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all duration-300 ${
                selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onClick={() => document.getElementById('education-certificate-input').click()}
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
                  <FileUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    Click to upload certificate
                  </p>
                  <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                    Supports PDF, JPEG, PNG (Max 5MB)
                  </p>
                </div>
              )}
              <input
                id="education-certificate-input"
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
  );
}

export default Education;