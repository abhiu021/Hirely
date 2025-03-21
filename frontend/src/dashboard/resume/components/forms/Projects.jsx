import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

function Projects({ enableNext }) {
    const params = useParams();
    const { getToken } = useAuth();
    const [projectsList, setProjectsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [githubUsername, setGithubUsername] = useState('');
    const [importLoading, setImportLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    useEffect(() => {
        if (resumeInfo?.projects) {
            setProjectsList(resumeInfo.projects);
        }
    }, [resumeInfo]);

    useEffect(() => {
        // Fetch resume data when the component mounts
        const fetchResumeData = async () => {
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
                const fetchedData = response.data?.data?.projects;  
                console.log('Fetched data:', fetchedData);

                // Set the projects list from fetched data
                if (fetchedData) {
                    setProjectsList(fetchedData);
                }
                
                toast.success("Projects fetched successfully");
            } catch (error) {
                console.error('Error fetching resume data:', error);
                toast.error("Failed to fetch resume details");
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [params, getToken]); // Dependencies include params and getToken

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newProjects = [...projectsList];
        newProjects[index][name] = value;
        setProjectsList(newProjects);
        
        // Update context for real-time preview
        setResumeInfo({
            ...resumeInfo,
            projects: newProjects
        });
    };

    const AddProject = () => {
        const newProject = {
            name: '',
            description: '',
            technologies: '',
            link: '',
            isVerified: false // Default to false for manually added projects
        };
        const updatedProjects = [newProject, ...projectsList];
        setProjectsList(updatedProjects);
        setResumeInfo({
            ...resumeInfo,
            projects: updatedProjects
        });
    };

    const RemoveProject = (index) => {
        const updatedProjects = projectsList.filter((_, i) => i !== index);
        setProjectsList(updatedProjects);
        setResumeInfo({
            ...resumeInfo,
            projects: updatedProjects
        });
    };

    const fetchGitHubProjects = async () => {
        setImportLoading(true);
        try {
            // Fetch repositories for the given GitHub username
            const response = await axios.get(
                `https://api.github.com/users/${githubUsername}/repos`
            );
            const repos = response.data;

            // Map repositories to the projects format
            const newProjects = repos.map((repo) => ({
                name: repo.name,
                description: repo.description || '',
                technologies: repo.language || 'Not specified', // GitHub provides primary language
                link: repo.html_url,
                isVerified: true // Mark as verified since it's from GitHub
            }));

            // Add the new projects to the existing list
            const updatedProjects = [...newProjects, ...projectsList];
            setProjectsList(updatedProjects);
            setResumeInfo({
                ...resumeInfo,
                projects: updatedProjects,
            });

            setGithubUsername('');
            toast.success("GitHub projects imported successfully");
        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            toast.error("Failed to fetch GitHub projects");
        } finally {
            setImportLoading(false);
        }
    };

    // Validate project link
    const validateProjectLink = async (link) => {
        try {
            const response = await axios.post('https://hirely-78iq.onrender.com/validate-link', {
                link: link,
            });
            return response.data.isValid;
        } catch (error) {
            console.error("Link validation failed:", error);
            return false;
        }
    };

    // Verify a project
    const verifyProject = async (index) => {
        const project = projectsList[index];
        if (!project.link) {
            toast.error("Please provide a project link to verify");
            return;
        }

        setLoading(true);
        try {
            const isValid = await validateProjectLink(project.link);
            if (isValid) {
                const updatedProjects = [...projectsList];
                updatedProjects[index].isVerified = true;
                setProjectsList(updatedProjects);
                setResumeInfo({
                    ...resumeInfo,
                    projects: updatedProjects,
                });
                toast.success("Project verified successfully");
            } else {
                toast.error("Invalid project link");
            }
        } catch (error) {
            console.error('Error verifying project:', error);
            toast.error("Failed to verify project");
        } finally {
            setLoading(false);
        }
    };

    const onSave = async (e) => {
        e.preventDefault();
    
        // Check if all projects are verified
        const allProjectsVerified = projectsList.every(project => project.isVerified);
        if (!allProjectsVerified) {
            toast.error("Please verify all project links before saving.");
            return;
        }
    
        setLoading(true);
        const data = {
            data: {
                projects: projectsList
            }
        };
    
        try {
            const id = params?.resumeId;
            const token = await getToken();
            const response = await axios.put(
                `https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            toast.success("Projects saved successfully");
        } catch (error) {
            console.error('Error updating resume:', error);
            toast.error("Failed to save projects");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                    <h2 className="font-bold text-lg">Projects</h2>
                    <p className="text-sm text-gray-600">Add your significant projects</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={AddProject} className="w-full sm:w-auto">Add Project</Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto">Import from GitHub</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Import GitHub Projects</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input
                                    placeholder="GitHub Username"
                                    value={githubUsername}
                                    onChange={(e) => setGithubUsername(e.target.value)}
                                />
                                <Button 
                                    onClick={fetchGitHubProjects}
                                    disabled={importLoading || !githubUsername}
                                    className="w-full"
                                >
                                    {importLoading ? <LoaderCircle className="animate-spin mr-2" /> : 'Import Projects'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <form onSubmit={onSave}>
                {projectsList.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="col-span-1 sm:col-span-2">
                                <label className="text-sm">Project Name</label>
                                <Input
                                    name="name"
                                    value={project.name}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <label className="text-sm">Technologies Used</label>
                                <Input
                                    name="technologies"
                                    value={project.technologies}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <label className="text-sm">Project Link</label>
                                <Input
                                    name="link"
                                    value={project.link}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <label className="text-sm">Description</label>
                                <Textarea
                                    name="description"
                                    value={project.description}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 border-t pt-3 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => RemoveProject(index)}
                                className="w-full sm:w-auto"
                            >
                                Remove Project
                            </Button>
                            <Button
                                type="button"
                                variant={project.isVerified ? "success" : "outline"}
                                onClick={() => project.isVerified ? null : verifyProject(index)}
                                disabled={project.isVerified}
                                className={`w-full sm:w-auto ${project.isVerified ? "bg-green-100 text-green-800 border-green-200" : ""}`}
                            >
                                {project.isVerified ? "Verified ✓" : "Verify Project Link"}
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="flex justify-end mt-4">
                    <Button 
                        type="submit" 
                        disabled={loading || (projectsList.length > 0 && !projectsList.every(p => p.isVerified))}
                        className={`w-full sm:w-auto ${projectsList.length > 0 && !projectsList.every(p => p.isVerified) ? "opacity-50 bg-gray-300 cursor-not-allowed" : ""}`}
                    >
                        {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
                    </Button>
                </div>
                
                {projectsList.length > 0 && !projectsList.every(p => p.isVerified) && (
                    <p className="text-xs text-amber-600 mt-2 text-right">
                        All project links must be verified before saving
                    </p>
                )}
            </form>
        </div>
    );
}

export default Projects;