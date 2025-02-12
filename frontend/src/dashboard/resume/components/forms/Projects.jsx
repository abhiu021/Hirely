import React, { useContext, useState, useEffect } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Projects({ enableNext }) {
    const [projectsList, setProjectsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [githubUrl, setGithubUrl] = useState('');
    const [importLoading, setImportLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const { resumeId } = useParams();

    useEffect(() => {
        if (resumeInfo?.projects) {
            setProjectsList(resumeInfo.projects);
        }
    }, [resumeInfo]);

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
        enableNext(false);
    };

    const AddProject = () => {
        const newProject = {
            name: '',
            description: '',
            technologies: '',
            link: ''
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

    const onSave = async () => {
        setLoading(true);
        const data = {
            data: {
                projects: projectsList.map(({ id, ...rest }) => rest)
            }
        };

        try {
            await axios.patch(
                `http://localhost:5000/api/dashboard/resume/${resumeId}`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success("Projects saved successfully");
            enableNext(true);
        } catch (error) {
            toast.error("Failed to save projects");
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubImport = async () => {
        setImportLoading(true);
        try {
            const response = await axios.post('/api/github/repo', { url: githubUrl });
            const repoData = response.data;
            const newProject = {
                name: repoData.name,
                description: repoData.description || '',
                technologies: repoData.languages.join(', '),
                link: repoData.html_url,
                startDate: '',
                endDate: ''
            };
            const updatedProjects = [newProject, ...projectsList];
            setProjectsList(updatedProjects);
            setResumeInfo({
                ...resumeInfo,
                projects: updatedProjects
            });
            toast.success("Project imported successfully");
        } catch (error) {
            toast.error("Failed to import project");
        } finally {
            setImportLoading(false);
        }
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="font-bold text-lg">Projects</h2>
                    <p className="text-sm text-gray-600">Add your significant projects</p>
                </div>
                <Button variant="outline" onClick={AddProject}>Add Project</Button>
            </div>

            <div className="flex mb-4">
                <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="Enter GitHub repository URL"
                />
                <Button onClick={handleGitHubImport} disabled={importLoading}>
                    {importLoading ? <LoaderCircle className="animate-spin mr-2" /> : null}
                    Import from GitHub
                </Button>
            </div>

            {projectsList.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium">Project Name</label>
                            <Input
                                name="name"
                                value={project.name || ''}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Enter project name"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium">Technologies Used</label>
                            <Input
                                name="technologies"
                                value={project.technologies || ''}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="e.g., React, Node.js, MongoDB"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium">Project Link</label>
                            <Input
                                name="link"
                                value={project.link || ''}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                name="description"
                                value={project.description || ''}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Describe your project..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => RemoveProject(index)}
                        className="mt-4 text-red-500 hover:text-red-700"
                    >
                        Remove Project
                    </Button>
                </div>
            ))}

            <div className="flex justify-end mt-4">
                <Button onClick={onSave} disabled={loading}>
                    {loading ? <LoaderCircle className="animate-spin mr-2" /> : null}
                    Save Projects
                </Button>
            </div>
        </div>
    );
}

export default Projects;