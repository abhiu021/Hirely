import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from 'axios';

function Projects({ enableNext }) {
    const { resumeId } = useParams();
    const [projectsList, setProjectsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [githubUrl, setGithubUrl] = useState('');
    const [importLoading, setImportLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

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
                isVerified: true
            };
            const updatedProjects = [newProject, ...projectsList];
            setProjectsList(updatedProjects);
            setResumeInfo({
                ...resumeInfo,
                projects: updatedProjects
            });
            setGithubUrl('');
            toast.success("GitHub project imported successfully");
        } catch (error) {
            toast.error("Failed to import GitHub project");
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
            enableNext(true);
            toast.success("Projects saved successfully");
        } catch (error) {
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
                                <DialogTitle>Import GitHub Project</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input
                                    placeholder="GitHub repository URL"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                />
                                <Button 
                                    onClick={handleGitHubImport}
                                    disabled={importLoading}
                                >
                                    {importLoading ? <LoaderCircle className="animate-spin mr-2" /> : 'Import'}
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