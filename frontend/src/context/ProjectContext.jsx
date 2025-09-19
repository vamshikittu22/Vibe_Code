import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { projects as projectsApi } from '../api/api';

// Create context
const ProjectContext = createContext({
  currentProject: null,
  files: [],
  loading: true,
  error: null,
  selectedFile: null,
  refreshProject: () => {},
  selectFile: () => {},
  updateFileContent: () => {},
  addFile: () => {},
  deleteFile: () => {},
  renameFile: () => {},
});

// Custom hook to use project context
export const useProject = () => useContext(ProjectContext);

// Project provider component
export const ProjectProvider = ({ children }) => {
  const { projectId } = useParams();
  const [currentProject, setCurrentProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project data
  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch project details
      const project = await projectsApi.getById(projectId);
      setCurrentProject(project);
      
      // Fetch project files
      const projectFiles = await projectsApi.getFiles(projectId);
      setFiles(projectFiles);
      
      // Select first file if none is selected
      if (projectFiles.length > 0 && !selectedFile) {
        setSelectedFile(projectFiles[0]);
      }
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId, selectedFile]);

  // Initial fetch when projectId changes
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Select a file
  const selectFile = (file) => {
    setSelectedFile(file);
  };

  // Update file content
  const updateFileContent = async (fileId, content) => {
    try {
      // Optimistic update
      setFiles(prevFiles =>
        prevFiles.map(file =>
          file.id === fileId ? { ...file, content } : file
        )
      );
      
      // Update in the backend
      await projectsApi.updateFile(projectId, fileId, { content });
    } catch (err) {
      console.error('Failed to update file:', err);
      // Revert on error
      fetchProject();
      throw err;
    }
  };

  // Add a new file
  const addFile = async (fileData) => {
    try {
      const newFile = await projectsApi.uploadFile(projectId, fileData);
      setFiles(prevFiles => [...prevFiles, newFile]);
      setSelectedFile(newFile);
      return newFile;
    } catch (err) {
      console.error('Failed to add file:', err);
      throw err;
    }
  };

  // Delete a file
  const deleteFile = async (fileId) => {
    try {
      await projectsApi.deleteFile(projectId, fileId);
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.filter(file => file.id !== fileId);
        
        // If the deleted file was selected, select another file
        if (selectedFile?.id === fileId) {
          setSelectedFile(updatedFiles[0] || null);
        }
        
        return updatedFiles;
      });
    } catch (err) {
      console.error('Failed to delete file:', err);
      throw err;
    }
  };

  // Rename a file
  const renameFile = async (fileId, newName) => {
    try {
      const updatedFile = await projectsApi.renameFile(projectId, fileId, newName);
      
      setFiles(prevFiles =>
        prevFiles.map(file =>
          file.id === fileId ? { ...file, name: newName } : file
        )
      );
      
      // Update selected file if it was renamed
      if (selectedFile?.id === fileId) {
        setSelectedFile(prev => ({ ...prev, name: newName }));
      }
      
      return updatedFile;
    } catch (err) {
      console.error('Failed to rename file:', err);
      throw err;
    }
  };

  // Context value
  const contextValue = {
    currentProject,
    files,
    loading,
    error,
    selectedFile,
    refreshProject: fetchProject,
    selectFile,
    updateFileContent,
    addFile,
    deleteFile,
    renameFile,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
