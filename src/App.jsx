import { useImmer } from 'use-immer'
import { useMemo, useEffect } from 'react';
import './css/input.css'
import Input from '@mui/joy/Input';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


function App() {
  const FILTERS = {
    ALL: 'All',
    COMPLETED: 'Completed',
    PENDING: 'Pending',
  };

  const [filter, setFilter] = useImmer(FILTERS.ALL);
  const [search, setSearch] = useImmer('');
  const [tasks, setTasks] = useImmer([]);
  const visibleTasks = useMemo(() => {
    if (search.trim() !== '') {
      return tasks.filter(task => task.task.toLowerCase().includes(search.toLowerCase()));
    } else {
      switch (filter) {
        case FILTERS.COMPLETED:
          return tasks.filter(task => task.completed);
        case FILTERS.PENDING:
          return tasks.filter(task => !task.completed);
        default:
          return tasks;
      }
    }

  }, [tasks, search, filter]);


  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveToLocalStorage();
    }
  }, [tasks]);


  function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }


  function handleOnAddTask(task) {
    let newTask = {
      id: uuidv4(),
      task: task,
      completed: false
    }

    setTasks((draft) => {
      draft.push(newTask);
    })
  }

  function handleOnDeleteTask(id) {
    setTasks((draft) => {
      const index = draft.findIndex(task => task.id === id);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    });
  }

  function handleOnEditTask(updatedTask) {
    setTasks((draft) => {
      const index = draft.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        draft[index] = updatedTask;
      }
    });
  }


  function handleOnSearch(event) {
    event.stopPropagation();
    // Handle search input change
    const value = event.target.value;
    setSearch(value);
  }

  function handleOnFilterChange(event, value) {
    event.stopPropagation();
    setFilter(value);
  }



  return (
    <>
      <div className='relative container h-[100vh] w-[80vw] mx-auto flex flex-col items-center'>
        <h1 className='text-2xl font-bold text-center my-3'>TODO LIST</h1>

        <div className="topBar my-5 md:my-2 w-4/5 flex md:flex-row flex-col gap-4 min-h-11">

          {/* search bar */}
          <div className="search w-full">
            <Input
              onChange={handleOnSearch}
              placeholder='Type in here' color='neutral'
              endDecorator={<SearchIcon />}
              sx={{
                height: '100%',
                "--Input-gap": "14px",
                "--Input-decoratorChildHeight": "29px",
                "--Input-placeholderOpacity": 0.5,
                "--Input-radius": "8px"
              }} />
          </div>

          {/* filter */}
          <div className="todoFilter md:w-1/4 w-full">
            <Select
              onChange={handleOnFilterChange}
              value={filter}
              indicator={<KeyboardArrowDown />}
              sx={{
                height: '100%',
                width: '100%',
                [`& .${selectClasses.indicator}`]: {
                  transition: '0.2s',
                  [`&.${selectClasses.expanded}`]: {
                    transform: 'rotate(-180deg)',
                  },
                },
              }}
            >
              <Option value={FILTERS.ALL}>{FILTERS.ALL}</Option>
              <Option value={FILTERS.PENDING}>{FILTERS.PENDING}</Option>
              <Option value={FILTERS.COMPLETED}>{FILTERS.COMPLETED}</Option>
            </Select>
          </div>

        </div>

        <AddTaskDialog handleOnAddTask={handleOnAddTask} />

        {/* Empty tasks message */}
        {
          visibleTasks.length === 0 && (
            <>
              <DotLottieReact
                className='md:w-[50%]'
                src="https://lottie.host/9a8ce764-7cf8-4de9-b756-e3697c0c86ec/f6wcsJT0Se.lottie"
                loop
                autoplay
                placeholder="Loading animation..."

              />

              <p className='text-lg font-bold text-violet-400'>Nothing found</p>
            </>
          )
        }


        {/* Tasks List */}
        <div className="tasks-container  md:w-1/2 w-[90vw] flex flex-col overflow-y-auto max-h-[100%] pr-1 ">
          {
          visibleTasks.map((task, index) => (
            <>
              {index > 0 && <hr className='mx-auto w-[80%] text-violet-300 my-3' />}
              <Task key={task.id}  {...task} onEdit={handleOnEditTask} onDelete={handleOnDeleteTask} />
            </>
          ))
        }
        </div>

      </div>

    </>
  )
}

function Task({ id, task, completed, onDelete, onEdit }) {
  function handleOnDeleteClick(event) {
    event.stopPropagation();
    onDelete(id);
  }

  function handleOnCheckboxChange(event) {
    event.stopPropagation();
    onEdit({ id, task, completed: event.target.checked });
  }

  function handleOnDeleteClick(event) {
    event.stopPropagation();
    onDelete(id);
  }

  return (
    <div className="w-[100%] p-3 transition-colors duration-150 md:bg-none  hover:bg-violet-50 rounded-xl task flex flex-row items-center justify-start group">

      {/* completed Checkbox */}
      <Checkbox
        sx={{
          color: '#6C63FF',
          '&.Mui-checked': {
            color: '#6C63FF',
          },
        }}
        checked={completed}
        onChange={handleOnCheckboxChange} />

      {/* task  */}
      <p className={`text-lg font-medium  pointer-events-none ${completed && "line-through"}`}>{task}</p>


      {/* action buttons */}
      <div className="buttons ml-auto md:opacity-0 opacity-70 md:invisible group-hover:opacity-80 group-hover:visible transition-opacity  ease-in group-hover:duration-1000 group-hover:ease-out">
        <IconButton
          sx={{
            color: '#6C63FF',
            '&:hover': {
              color: '#4F49BB',
            },
          }}
          onClick={handleOnDeleteClick}
          aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
}

function AddTaskDialog({ handleOnAddTask }) {
  const [addDialogOpen, setAddDialogOpen] = useImmer(false);
  const [task, setTask] = useImmer('');

  function handleClickAddDialogOpen() {
    setAddDialogOpen(true);
  }

  function handleAddDialogClose() {
    // Reset task input when dialog is closed
    setTask('');
    setAddDialogOpen(false);
  }
  function handleOnAddClick(event) {
    event.stopPropagation();
    handleClickAddDialogOpen();
  }

  function handleOnAddTaskClick() {
    if (task.trim() === '') {
      alert('Task cannot be empty');
      return;
    }

    handleOnAddTask(task);
    setTask('');
    handleAddDialogClose();
  }

  return (

    <>

      <div className="fab absolute bottom-14 right-5 md:bottom-5 md:right-6 z-50">
        <Fab
          onClick={handleOnAddClick}
          aria-label="add"
          sx={{

            backgroundColor: '#6C63FF',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#4F49BB',
            },
          }}
        >
          <AddIcon />
        </Fab>
      </div>

      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
      >

        <div className="taskInput flex items-center justify-center">
          <DialogContent>
            <TextField
              value={task}
              onChange={(e) => {
                setTask(e.target.value)  // 💡 Debugging: Log the input value
              }}
              autoFocus
              required
              margin="dense"
              label="Task"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <IconButton
              onClick={handleAddDialogClose}
              aria-label="cancel"
            >
              <CloseIcon className='text-red-400' />
            </IconButton>

            <IconButton
              type='submit'
              onClick={handleOnAddTaskClick}
              aria-label="add">
              <CheckIcon className='text-green-500' />
            </IconButton>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}

export default App
