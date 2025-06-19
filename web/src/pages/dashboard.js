// src/pages/dashboard.js
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/authContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Popup from "reactjs-popup";
import NewTask from "../components/newTask";
import api from '../hooks/api';
import Header from '../components/header';
import AppIcon from '../assets/original_no_bg.png';

// Key for localStorage
const TEMP_TASKS_KEY = 'temp_unsaved_tasks';

export default function Dashboard() {
  const [userData, setUserData] = useState({
    username: '',
    memberSince: '',
    profileImage: null,
    tasks: [],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const { userId } = useAuth();

  const closeModal = () => setIsOpen(false);

  const handleTaskSubmit = async (taskData) => {
    if (!taskData) {
      return closeModal();
    }

    try {
      if (userId) {
        // Logged in user - save to API
        const response = await api.post('/tasks', { ...taskData, userId });
        
        if (response.status === 201) {
          setMessage({ text: 'Task created successfully!', isError: false });
          setUserData(prev => ({
            ...prev,
            tasks: [...prev.tasks, response.data.task]
          }));
        }
      } else {
        // Non-logged in user - save to localStorage
        const newTask = {
          ...taskData,
          id: Date.now() // Simple unique ID
        };
        
        const existingTasks = JSON.parse(localStorage.getItem(TEMP_TASKS_KEY)) || [];
        const updatedTasks = [...existingTasks, newTask];
        localStorage.setItem(TEMP_TASKS_KEY, JSON.stringify(updatedTasks));
        
        setMessage({ text: 'Task saved temporarily!', isError: false });
        setUserData(prev => ({
          ...prev,
          tasks: updatedTasks
        }));
      }

      setTimeout(() => {
        closeModal();
        setMessage({ text: '', isError: false });
      }, 3000);
    } catch (err) {
      console.error(err);
      setMessage({ 
        text: userId 
          ? 'Failed to create task. Please try again.' 
          : 'Failed to save task locally', 
        isError: true 
      });
      setTimeout(() => setMessage({ text: '', isError: false }), 3000);
    }
  };

  // Clear localStorage tasks when window closes
  useEffect(() => {
    const clearTasksOnUnload = () => {
      localStorage.removeItem(TEMP_TASKS_KEY);
    };

    window.addEventListener('beforeunload', clearTasksOnUnload);
    return () => {
      window.removeEventListener('beforeunload', clearTasksOnUnload);
    };
  }, []);

  // Load tasks on mount
  useEffect(() => {
    async function loadData() {
      if (userId) {
        // Load from API for logged in users
        try {
          const response = await api.get(`/users/me/${userId}`);
          if (response.status === 200) {
            const user = response.data.user;
            setUserData({
              username: user.username,
              memberSince: user.memberSince,
              profileImage: user.profileIcon,
              tasks: user.savedTasks || [],
            });
          }
        } catch (err) {
          console.error(err);
          setUserData(prev => ({
            ...prev,
            username: 'Unknown User',
            memberSince: '9999',
            profileImage: AppIcon,
            tasks: []
          }));
        }
      } else {
        // For non-logged in users, tasks are cleared on each launch
        // so we don't load from localStorage here
        setUserData(prev => ({
          ...prev,
          username: 'Unknown User',
          memberSince: '9999',
          profileImage: AppIcon,
          tasks: []
        }));
      }
    }

    loadData();
  }, [userId]);

  const displayUserTasks = () => {
    return userData.tasks.map((ut) => (
      <div 
        className="flex flex-col items-center justify-center w-[90%] h-32 bg-primary border-accent border-2 rounded-xl mb-3"
        key={ut.id}>
        <h3 className="font-bold italic text-center text-lg text-fontColor w-full mt-1">
          {ut.title}
        </h3>
        <div className="flex flex-row items-center justify-center w-full flex-1">
          <div className="flex flex-col items-center justify-center w-full">
            <p className="italic text-fontColor text-xs">
              {ut.description}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <p className="italic text-fontColor text-xs">
              Due: {ut.dueDate}
            </p>
            <p className="italic text-fontColor text-xs">
              Priority: {ut.priority}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-secondary via-primary to-primary">
      <Header userId={userId} userData={userData} />

      <main className="flex flex-col items-center justify-center w-full flex-1">
        <div className="flex flex-col items-center justify-start w-1/2 h-[650px] bg-secondary border-primary border-2 rounded-xl">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="border-2 border-accent w-[90%] py-5 rounded-2xl bg-primary font-bold italic text-fontColor text-lg mt-5"
          >
            New Task
            <FontAwesomeIcon icon={faPlus} className="ml-2" />
          </button>

          {userData.tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-evenly w-[50%] flex-1">
              <p className="italic text-lg text-center">
                You currently have no tasks. Click the
                &#34;New Task +&#34; button above to get
                started!
              </p>
              {!userId && (
                <p className="italic text-lg text-center">
                  If you wish to have your tasks saved when you create them,
                  then click the &#34;Sign Up&#34; button above to create a 
                  new account, or, click the &#34;Login&#34; button above to
                  pull up your existing tasks.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-start w-full flex-1 gap-3 mt-5 overflow-y-auto">
              {displayUserTasks()}
            </div>
          )}
        </div>

        <Popup
          open={isOpen}
          closeOnDocumentClick
          onClose={closeModal}
          overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-secondary border-2 border-primary rounded-xl p-6 w-full max-w-lg">
            <NewTask onSubmit={handleTaskSubmit} message={message} />
          </div>
        </Popup>
      </main>
    </div>
  );
};