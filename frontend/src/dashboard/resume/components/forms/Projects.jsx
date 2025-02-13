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
                const response = await axios.get(`http://localhost:5000/api/dashboard/resume/${id}/edit`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Response:', response);
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
                isVerified: true, // Mark as verified since it's from GitHub
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

    const onSave = async (e) => {
        e.preventDefault();
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
                `http://localhost:5000/api/dashboard/resume/${id}/edit`,
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
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="font-bold text-lg">Projects</h2>
                    <p className="text-sm text-gray-600">Add your significant projects</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={AddProject}>Add Project</Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Import from GitHub</Button>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-sm">Project Name</label>
                                <Input
                                    name="name"
                                    value={project.name}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm">Technologies Used</label>
                                <Input
                                    name="technologies"
                                    value={project.technologies}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm">Project Link</label>
                                <Input
                                    name="link"
                                    value={project.link}
                                    onChange={(e) => handleChange(e, index)}
                                />
                            </div>
                            <div className="col-span-2">
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => RemoveProject(index)}
                            className="mt-4"
                        >
                            Remove Project
                        </Button>
                    </div>
                ))}

                <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Projects;