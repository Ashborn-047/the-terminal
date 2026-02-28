import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, BookOpen, CheckCircle2, Award, Target, ArrowRight, 
  Search, Copy, Check, Zap, Trophy, Play, RotateCcw, 
  Flame, Star, Menu, X, ChevronDown, Code2, Sparkles
} from 'lucide-react';

// --- INITIAL FILE SYSTEM ---
const initialFileSystem = {
  home: {
    type: 'dir',
    content: {
      guest: {
        type: 'dir',
        content: {
          'readme.txt': { type: 'file', content: 'Welcome to the IIT Delhi HPC Lab Environment.\nThis system is used for high performance computing tasks.\nPlease review the guidelines.' },
          'data.csv': { type: 'file', content: 'id,name,status\n1,node_alpha,active\n2,node_beta,offline\n3,node_gamma,active\n4,node_delta,active' },
          documents: { type: 'dir', content: {} },
          downloads: { type: 'dir', content: {} }
        }
      }
    }
  },
  etc: { type: 'dir', content: { 'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:guest,,,:/home/guest:/bin/bash' } } },
  var: { type: 'dir', content: { log: { type: 'dir', content: { 'syslog': { type: 'file', content: 'System boot...\nNetwork initialized.\nSSH daemon started.' } } } } },
  usr: { type: 'dir', content: { bin: { type: 'dir', content: {} } } },
  proc: {
    type: 'dir',
    content: {
      'cpuinfo': { type: 'file', content: 'processor       : 0\nvendor_id       : GenuineIntel\ncpu family      : 6\nmodel name      : Intel(R) Xeon(R) CPU @ 2.30GHz\ncores           : 4' },
      'meminfo': { type: 'file', content: 'MemTotal:        8192000 kB\nMemFree:         4123000 kB\nMemAvailable:    6100000 kB\nSwapTotal:       2048000 kB' }
    }
  }
};

// --- ENTERPRISE LAB CURRICULUM ---
const curriculum = [
  {
    id: 'lab-fs-utils',
    title: 'Filesystem Basics',
    type: 'guided',
    duration: '5 mins',
    difficulty: 'beginner',
    icon: '📁',
    objectives: [
      'List files with detailed formatting',
      'Copy files between directories',
      'Remove directories safely'
    ],
    steps: [
      {
        instruction: 'The "ls" command lists directory contents. The "-l" flag shows detailed information including permissions, owner, and size.',
        actionText: 'List files in long format',
        expectedCmd: 'ls -l'
      },
      {
        instruction: 'The "cp" command copies files. It takes two arguments: the source file and the destination.',
        actionText: 'Create a backup copy',
        expectedCmd: 'cp data.csv backup.csv'
      },
      {
        instruction: 'The "rm" command removes files. Use "-rf" to recursively force-delete directories.',
        actionText: 'Remove the downloads folder',
        expectedCmd: 'rm -rf downloads'
      }
    ]
  },
  {
    id: 'lab-sys-info',
    title: 'System Information',
    type: 'guided',
    duration: '5 mins',
    difficulty: 'beginner',
    icon: '💻',
    objectives: [
      'Check system architecture',
      'View hardware specifications',
      'Monitor memory usage'
    ],
    steps: [
      {
        instruction: 'The "uname" command displays system information. Use "-a" to show all available information.',
        actionText: 'Display system information',
        expectedCmd: 'uname -a'
      },
      {
        instruction: 'In Linux, hardware information is stored in the /proc directory. Let\'s read the CPU info.',
        actionText: 'View CPU specifications',
        expectedCmd: 'cat /proc/cpuinfo'
      },
      {
        instruction: 'The "free" command shows memory usage statistics for RAM and swap space.',
        actionText: 'Check memory usage',
        expectedCmd: 'free'
      },
      {
        instruction: 'The "w" command shows who is logged in and what they\'re doing.',
        actionText: 'View logged in users',
        expectedCmd: 'w'
      }
    ]
  },
  {
    id: 'lab-networking',
    title: 'Networking Commands',
    type: 'guided',
    duration: '5 mins',
    difficulty: 'intermediate',
    icon: '🌐',
    objectives: [
      'Test network connectivity',
      'Perform DNS lookups',
      'Download files from the internet'
    ],
    steps: [
      {
        instruction: 'The "ping" command tests network connectivity by sending ICMP packets to a host.',
        actionText: 'Test connectivity to Google',
        expectedCmd: 'ping google.com'
      },
      {
        instruction: 'The "dig" command performs DNS lookups and shows detailed DNS records.',
        actionText: 'Query DNS records',
        expectedCmd: 'dig google.com'
      },
      {
        instruction: 'The "wget" command downloads files from the internet directly to your server.',
        actionText: 'Download a script file',
        expectedCmd: 'wget script.sh'
      },
      {
        instruction: 'Verify the download was successful by listing the directory contents.',
        actionText: 'List files',
        expectedCmd: 'ls'
      }
    ]
  },
  {
    id: 'lab-archiving',
    title: 'File Compression',
    type: 'guided',
    duration: '5 mins',
    difficulty: 'intermediate',
    icon: '📦',
    objectives: [
      'Create tar archives',
      'Bundle multiple files together'
    ],
    steps: [
      {
        instruction: 'The "tar" (Tape Archive) command bundles files. "c" creates, "f" specifies the filename.',
        actionText: 'Create an archive',
        expectedCmd: 'tar cf archive.tar data.csv'
      },
      {
        instruction: 'Verify the archive was created successfully.',
        actionText: 'List files',
        expectedCmd: 'ls'
      }
    ]
  },
  {
    id: 'lab-diy-hpc',
    title: 'HPC Environment Setup',
    type: 'diy',
    duration: '10 mins',
    difficulty: 'advanced',
    icon: '🚀',
    objectives: [
      'Apply commands independently',
      'Set up a working environment'
    ],
    scenario: 'You need to prepare an environment for a high-performance computing job. Create the necessary directory structure, organize files, and prepare job scripts.',
    goals: [
      {
        id: 'g1',
        text: 'Create a directory named "hpc_job"',
        verify: (fs) => checkPathExists(fs, ['home', 'guest', 'hpc_job'], 'dir')
      },
      {
        id: 'g2',
        text: 'Move "data.csv" into the "hpc_job" directory',
        verify: (fs) => checkPathExists(fs, ['home', 'guest', 'hpc_job', 'data.csv'], 'file') && !checkPathExists(fs, ['home', 'guest', 'data.csv'], 'file')
      },
      {
        id: 'g3',
        text: 'Create an empty file named "job.sh" inside "hpc_job"',
        verify: (fs) => checkPathExists(fs, ['home', 'guest', 'hpc_job', 'job.sh'], 'file')
      }
    ]
  }
];

// --- COMPREHENSIVE COMMAND REFERENCE ---
const commandDocs = [
  {
    category: "File Management",
    icon: "📁",
    commands: [
      { cmd: 'ls', desc: 'List directory contents', usage: 'ls -la', tags: ['files', 'directory'] },
      { cmd: 'cd', desc: 'Change directory', usage: 'cd /var/log', tags: ['navigation'] },
      { cmd: 'pwd', desc: 'Print working directory', usage: 'pwd', tags: ['navigation'] },
      { cmd: 'mkdir', desc: 'Create a new directory', usage: 'mkdir new_folder', tags: ['create'] },
      { cmd: 'touch', desc: 'Create an empty file', usage: 'touch file.txt', tags: ['create'] },
      { cmd: 'cp', desc: 'Copy files or directories', usage: 'cp source.txt dest.txt', tags: ['copy'] },
      { cmd: 'mv', desc: 'Move or rename files', usage: 'mv old.txt new.txt', tags: ['move'] },
      { cmd: 'rm', desc: 'Delete files or directories', usage: 'rm -rf folder/', tags: ['delete'] }
    ]
  },
  {
    category: "Text Processing",
    icon: "📝",
    commands: [
      { cmd: 'cat', desc: 'Display file contents', usage: 'cat file.txt', tags: ['view', 'read'] },
      { cmd: 'grep', desc: 'Search text using patterns', usage: 'grep "error" log.txt', tags: ['search'] },
      { cmd: 'less', desc: 'View files page by page', usage: 'less large_file.log', tags: ['view'] },
      { cmd: 'head', desc: 'Show first lines of file', usage: 'head -n 20 file.txt', tags: ['view'] },
      { cmd: 'tail', desc: 'Show last lines of file', usage: 'tail -f log.txt', tags: ['view'] },
      { cmd: 'wc', desc: 'Count lines, words, characters', usage: 'wc -l file.txt', tags: ['count'] }
    ]
  },
  {
    category: "System Information",
    icon: "💻",
    commands: [
      { cmd: 'uname', desc: 'System information', usage: 'uname -a', tags: ['system'] },
      { cmd: 'whoami', desc: 'Current username', usage: 'whoami', tags: ['user'] },
      { cmd: 'top', desc: 'Process monitor', usage: 'top', tags: ['monitor', 'process'] },
      { cmd: 'ps', desc: 'List processes', usage: 'ps aux', tags: ['process'] },
      { cmd: 'free', desc: 'Memory usage', usage: 'free -h', tags: ['memory'] },
      { cmd: 'df', desc: 'Disk usage', usage: 'df -h', tags: ['disk'] }
    ]
  },
  {
    category: "Networking",
    icon: "🌐",
    commands: [
      { cmd: 'ping', desc: 'Test network connectivity', usage: 'ping google.com', tags: ['network', 'test'] },
      { cmd: 'dig', desc: 'DNS lookup utility', usage: 'dig example.com', tags: ['dns'] },
      { cmd: 'wget', desc: 'Download files', usage: 'wget http://example.com/file', tags: ['download'] },
      { cmd: 'curl', desc: 'Transfer data from URLs', usage: 'curl http://example.com', tags: ['http'] }
    ]
  },
  {
    category: "Utilities",
    icon: "🛠️",
    commands: [
      { cmd: 'tar', desc: 'Archive files', usage: 'tar -czf archive.tar.gz folder/', tags: ['compress'] },
      { cmd: 'sudo', desc: 'Run as superuser', usage: 'sudo command', tags: ['admin'] },
      { cmd: 'chmod', desc: 'Change permissions', usage: 'chmod 755 script.sh', tags: ['permissions'] },
      { cmd: 'echo', desc: 'Print text', usage: 'echo "Hello World"', tags: ['output'] },
      { cmd: 'history', desc: 'Command history', usage: 'history', tags: ['history'] },
      { cmd: 'clear', desc: 'Clear terminal', usage: 'clear', tags: ['clean'] }
    ]
  }
];

// --- UTILITY FUNCTIONS ---
const cloneFS = (fs) => JSON.parse(JSON.stringify(fs));

const resolvePath = (cwd, target) => {
  if (!target) return cwd;
  const parts = target.split('/').filter(Boolean);
  let result = target.startsWith('/') ? [] : [...cwd];
  for (let part of parts) {
    if (part === '..') {
      if (result.length > 0) result.pop();
    } else if (part === '~') {
      result = ['home', 'guest'];
    } else if (part !== '.') {
      result.push(part);
    }
  }
  return result;
};

const getNode = (fs, pathArr) => {
  let current = { type: 'dir', content: fs };
  for (let i = 0; i < pathArr.length; i++) {
    if (current.type !== 'dir' || !current.content || !current.content[pathArr[i]]) {
      return null;
    }
    current = current.content[pathArr[i]];
  }
  return current;
};

const checkPathExists = (fs, pathArr, type) => {
  const node = getNode(fs, pathArr);
  return node !== null && node.type === type;
};

const getAllCommands = () => {
  return [
    'ls', 'pwd', 'cd', 'mkdir', 'rmdir', 'touch', 'cp', 'mv', 'rm',
    'cat', 'grep', 'tar', 'ping', 'wget', 'curl', 'date', 'free',
    'uname', 'w', 'wc', 'top', 'ps', 'kill', 'uptime', 'env',
    'whoami', 'history', 'sudo', 'clear', 'echo', 'dig', 'help'
  ];
};

export default function App() {
  // Terminal State
  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [currentPath, setCurrentPath] = useState(['home', 'guest']);
  const [history, setHistory] = useState([
    { type: 'system', text: '🎓 Welcome to Linux Terminal Academy' },
    { type: 'system', text: 'Type commands or select a lab to get started.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabSuggestions, setTabSuggestions] = useState([]);

  // UI State
  const [activeView, setActiveView] = useState('home'); // 'home', 'labs', 'docs', 'lab-active'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Gamification State
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('linux-academy-xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('linux-academy-streak');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [completedLabs, setCompletedLabs] = useState(() => {
    const saved = localStorage.getItem('linux-academy-completed');
    return saved ? JSON.parse(saved) : [];
  });

  // Training Platform State
  const [activeLabIndex, setActiveLabIndex] = useState(0);
  const [labStatus, setLabStatus] = useState('intro');
  const [guidedStep, setGuidedStep] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(new Set());

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const activeLab = curriculum[activeLabIndex];

  useEffect(() => {
    localStorage.setItem('linux-academy-xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('linux-academy-streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('linux-academy-completed', JSON.stringify(completedLabs));
  }, [completedLabs]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const showToast = (message, icon = '✨') => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-slide-in-from-top-4';
    toast.innerHTML = `<span class="text-lg">${icon}</span><span class="font-semibold">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(text);
      setTimeout(() => setCopiedCmd(null), 2000);
    }).catch(() => {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCmd(text);
      setTimeout(() => setCopiedCmd(null), 2000);
    });
  };

  // DIY LAB AUTO-VERIFICATION
  useEffect(() => {
    if (activeLab.type === 'diy' && labStatus === 'running') {
      let newlyCompleted = new Set(completedGoals);
      let allDone = true;

      activeLab.goals.forEach(goal => {
        if (goal.verify(fileSystem, currentPath)) {
          if (!completedGoals.has(goal.id)) {
            newlyCompleted.add(goal.id);
            setXp(prev => prev + 20);
            showToast('+20 XP! Goal complete!', '🎯');
          }
        } else {
          allDone = false;
        }
      });

      if (newlyCompleted.size !== completedGoals.size) {
        setCompletedGoals(newlyCompleted);
      }

      if (allDone && activeLab.goals.length > 0 && labStatus === 'running') {
        setLabStatus('completed');
        setXp(prev => prev + 100);
        setStreak(prev => prev + 1);
        showToast('Lab completed! +100 XP', '🏆');
        setHistory(prev => [...prev, { type: 'success', text: '✓ Lab completed successfully!' }]);
        
        if (!completedLabs.includes(activeLab.id)) {
          setCompletedLabs(prev => [...prev, activeLab.id]);
        }
      }
    }
  }, [fileSystem, currentPath, activeLab, labStatus, completedGoals]);

  const startLab = (index) => {
    setActiveLabIndex(index);
    setLabStatus('running');
    setGuidedStep(0);
    setCompletedGoals(new Set());
    setActiveView('lab-active');
    
    setFileSystem(cloneFS(initialFileSystem));
    setCurrentPath(['home', 'guest']);
    setHistory([{ type: 'system', text: `🎯 Lab: ${curriculum[index].title}` }]);
    inputRef.current?.focus();
  };

  // COMMAND ENGINE
  const commands = {
    pwd: (args, cwd) => '/' + cwd.join('/'),
    ls: (args, cwd, fs) => {
      let isLong = args.some(a => a.includes('l'));
      let isAll = args.some(a => a.includes('a'));
      let targetArgs = args.filter(a => !a.startsWith('-'));
      
      const targetDir = targetArgs[0] ? resolvePath(cwd, targetArgs[0]) : cwd;
      const node = getNode(fs, targetDir);
      
      if (!node) return `ls: cannot access '${targetArgs[0]}': No such file or directory`;
      if (node.type !== 'dir') return targetArgs[0];
      
      let contents = Object.keys(node.content);
      if (!isAll) contents = contents.filter(name => !name.startsWith('.'));
      if (contents.length === 0) return '';
      
      if (isLong) {
          return contents.map(name => {
              const isDir = node.content[name].type === 'dir';
              const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
              const size = isDir ? '4096' : (node.content[name].content?.length || 0);
              return `${perms} 1 guest guest ${size.toString().padStart(5)} Feb 23 10:00 ${isDir ? name+'/' : name}`;
          }).join('\n');
      }
      return contents.map(name => node.content[name].type === 'dir' ? `${name}/` : name).join('  ');
    },
    cd: (args, cwd, fs, setCwd) => {
      const target = args[0] || '~';
      const newPath = resolvePath(cwd, target);
      const node = getNode(fs, newPath);
      if (!node) return `bash: cd: ${target}: No such file or directory`;
      if (node.type !== 'dir') return `bash: cd: ${target}: Not a directory`;
      setCwd(newPath);
      return '';
    },
    cat: (args, cwd, fs) => {
      if (!args[0]) return `cat: missing operand`;
      const targetPath = resolvePath(cwd, args[0]);
      const node = getNode(fs, targetPath);
      if (!node) return `cat: ${args[0]}: No such file or directory`;
      if (node.type === 'dir') return `cat: ${args[0]}: Is a directory`;
      return node.content;
    },
    mkdir: (args, cwd, fs, setCwd, setFs) => {
      if (!args[0]) return `mkdir: missing operand`;
      const newFs = cloneFS(fs);
      const targetPath = resolvePath(cwd, args[0]);
      const dirName = targetPath.pop();
      const parentNode = getNode(newFs, targetPath);
      if (!parentNode || parentNode.type !== 'dir') return `mkdir: cannot create directory '${args[0]}': No such file or directory`;
      if (parentNode.content[dirName]) return `mkdir: cannot create directory '${args[0]}': File exists`;
      parentNode.content[dirName] = { type: 'dir', content: {} };
      setFs(newFs);
      return '';
    },
    touch: (args, cwd, fs, setCwd, setFs) => {
      if (!args[0]) return `touch: missing file operand`;
      const newFs = cloneFS(fs);
      const targetPath = resolvePath(cwd, args[0]);
      const fileName = targetPath.pop();
      const parentNode = getNode(newFs, targetPath);
      if (!parentNode || parentNode.type !== 'dir') return `touch: cannot touch '${args[0]}': No such file or directory`;
      if (!parentNode.content[fileName]) {
         parentNode.content[fileName] = { type: 'file', content: '' };
         setFs(newFs);
      }
      return '';
    },
    rm: (args, cwd, fs, setCwd, setFs) => {
      let targetArgs = args.filter(a => !a.startsWith('-'));
      if (!targetArgs[0]) return `rm: missing operand`;
      
      const newFs = cloneFS(fs);
      const targetPath = resolvePath(cwd, targetArgs[0]);
      const fileName = targetPath.pop();
      const parentNode = getNode(newFs, targetPath);
      
      if (!parentNode || !parentNode.content[fileName]) {
        return args.some(a => a.includes('f')) ? '' : `rm: cannot remove '${targetArgs[0]}': No such file or directory`;
      }
      if (parentNode.content[fileName].type === 'dir' && !args.some(a => a.includes('r'))) {
         return `rm: cannot remove '${targetArgs[0]}': Is a directory`;
      }
      delete parentNode.content[fileName];
      setFs(newFs);
      return '';
    },
    cp: (args, cwd, fs, setCwd, setFs) => {
      if (args.length < 2) return `cp: missing file operand`;
      const srcPath = resolvePath(cwd, args[0]);
      const destPath = resolvePath(cwd, args[1]);
      const srcNode = getNode(fs, srcPath);
      if (!srcNode) return `cp: cannot stat '${args[0]}': No such file or directory`;
      
      const newFs = cloneFS(fs);
      const destParentPath = [...destPath];
      const destName = destParentPath.pop();
      let destParent = getNode(newFs, destParentPath);
      
      if (!destParent || destParent.type !== 'dir') return `cp: cannot create regular file '${args[1]}': No such file or directory`;
      
      let actualDest = destParent.content[destName];
      if (actualDest && actualDest.type === 'dir') {
          actualDest.content[srcPath[srcPath.length-1]] = JSON.parse(JSON.stringify(srcNode));
      } else {
          destParent.content[destName] = JSON.parse(JSON.stringify(srcNode));
      }
      setFs(newFs);
      return '';
    },
    mv: (args, cwd, fs, setCwd, setFs) => {
      if (args.length < 2) return `mv: missing file operand`;
      const srcPath = resolvePath(cwd, args[0]);
      const destPath = resolvePath(cwd, args[1]);
      const srcNode = getNode(fs, srcPath);
      if (!srcNode) return `mv: cannot stat '${args[0]}': No such file or directory`;
      
      const newFs = cloneFS(fs);
      const srcParentPath = [...srcPath];
      const srcName = srcParentPath.pop();
      const srcParent = getNode(newFs, srcParentPath);
      const srcNodeCopy = JSON.parse(JSON.stringify(srcParent.content[srcName]));
      delete srcParent.content[srcName]; 

      const destParentPath = [...destPath];
      const destName = destParentPath.pop();
      let destParent = getNode(newFs, destParentPath);
      
      if (destParent && destParent.type === 'dir') {
          let actualDest = destParent.content[destName];
          if (actualDest && actualDest.type === 'dir') {
              actualDest.content[srcName] = srcNodeCopy;
          } else {
              destParent.content[destName] = srcNodeCopy;
          }
      }
      setFs(newFs);
      return '';
    },
    grep: (args, cwd, fs) => {
      if (args.length < 2) return `grep: usage: grep [pattern] [file]`;
      const pattern = args[args[0].startsWith('-') ? 1 : 0];
      const target = args[args[0].startsWith('-') ? 2 : 1];
      const node = getNode(fs, resolvePath(cwd, target));
      if (!node || node.type !== 'file') return `grep: ${target}: No such file`;
      return node.content.split('\n').filter(l => l.includes(pattern)).join('\n');
    },
    tar: (args, cwd, fs, setCwd, setFs) => {
      if (args.length < 2) return `tar: Must specify one of -c, -r, -t, -u, -x`;
      if (args[0].includes('c')) {
          const fileName = args[1];
          const newFs = cloneFS(fs);
          const parentNode = getNode(newFs, cwd);
          if (parentNode && parentNode.type === 'dir') {
              parentNode.content[fileName] = { type: 'file', content: `[Tar Archive Binary Content]` };
              setFs(newFs);
          }
          return '';
      }
      return '';
    },
    ping: (args) => {
      const target = args[0] || '8.8.8.8';
      return `PING ${target} (192.168.1.1) 56(84) bytes of data.\n64 bytes from ${target}: icmp_seq=1 ttl=117 time=14.2 ms\n64 bytes from ${target}: icmp_seq=2 ttl=117 time=12.5 ms\n64 bytes from ${target}: icmp_seq=3 ttl=117 time=13.1 ms\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss`;
    },
    dig: (args) => {
      const target = args[0] || 'example.com';
      return `; <<>> DiG 9.16.1-Ubuntu <<>> ${target}\n;; global options: +cmd\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345\n;; QUESTION SECTION:\n;${target}.                IN      A\n\n;; ANSWER SECTION:\n${target}.         3600    IN      A       93.184.216.34\n\n;; Query time: 24 msec`;
    },
    wget: (args, cwd, fs, setCwd, setFs) => {
      if (!args[0]) return `wget: missing URL`;
      const fileName = args[0].split('/').pop() || 'index.html';
      const newFs = cloneFS(fs);
      const parentNode = getNode(newFs, cwd);
      if (parentNode && parentNode.type === 'dir') {
          parentNode.content[fileName] = { type: 'file', content: `Downloaded content from ${args[0]}` };
          setFs(newFs);
      }
      return `--2026-02-23 12:00:00--  ${args[0]}\nResolving host... connected.\nHTTP request sent, awaiting response... 200 OK\nSaving to: '${fileName}'\n\n'${fileName}' saved.`;
    },
    curl: (args) => {
      const url = args[args.length - 1] || 'http://example.com';
      return `<!doctype html>\n<html>\n<head>\n    <title>Example Domain</title>\n</head>\n<body>\n<h1>Example Domain</h1>\n<p>This domain is for use in illustrative examples.</p>\n</body>\n</html>`;
    },
    date: () => new Date().toString(),
    free: () => `              total        used        free      shared  buff/cache   available\nMem:        8192000     1245000     4123000       12000     2824000     6100000\nSwap:       2048000           0     2048000`,
    uname: (args) => args.includes('-a') ? 'Linux server 5.15.0-101-generic #111-Ubuntu SMP x86_64 GNU/Linux' : 'Linux',
    w: () => ` 14:32:11 up 14 days,  2:11,  2 users,  load average: 0.04, 0.03, 0.00\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\nguest    pts/0    192.168.1.100    12:15    0.00s  0.05s  0.00s bash`,
    wc: (args, cwd, fs) => {
      if (!args[0]) return `wc: missing operand`;
      const node = getNode(fs, resolvePath(cwd, args[0]));
      if (!node || node.type !== 'file') return `wc: ${args[0]}: No such file`;
      const lines = node.content.split('\n').length;
      const words = node.content.split(/\s+/).filter(Boolean).length;
      const bytes = node.content.length;
      return ` ${lines}  ${words} ${bytes} ${args[0]}`;
    },
    top: () => `top - 10:23:45 up 1 day,  2:34,  1 user,  load average: 0.00, 0.01, 0.05\nTasks: 110 total,   1 running, 109 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  0.3 us,  0.1 sy,  0.0 ni, 99.5 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st\nMiB Mem :   7964.0 total,   4123.5 free,   1245.2 used,   2595.3 buff/cache`,
    ps: () => `  PID TTY          TIME CMD\n  543 pts/0    00:00:00 bash\n 1024 pts/0    00:00:00 ps`,
    kill: (args) => args[0] ? `Process ${args[0]} terminated` : `kill: usage: kill [pid]`,
    uptime: () => ` 14:32:11 up 14 days,  2:11,  2 users,  load average: 0.04, 0.03, 0.00`,
    env: () => `SHELL=/bin/bash\nUSER=guest\nPWD=/home/guest\nHOME=/home/guest\nLANG=en_US.UTF-8\nTERM=xterm-256color`,
    whoami: () => `guest`,
    echo: (args) => args.join(' '),
    history: (args, cwd, fs, setCwd, setFs, input, hist) => {
      return hist.slice(0, 20).map((cmd, i) => ` ${i + 1}  ${cmd}`).reverse().join('\n');
    },
    sudo: (args, cwd, fs, setCwd, setFs, input, hist) => {
      if (!args.length) return "usage: sudo [command]";
      const subCmd = args.shift();
      if (commands[subCmd]) {
        if (subCmd === 'whoami') return 'root';
        return commands[subCmd](args, cwd, fs, setCwd, setFs, input, hist);
      }
      return `sudo: ${subCmd}: command not found`;
    },
    help: () => {
      return `Available Commands:\n\nls, cd, pwd, mkdir, touch, rm, cp, mv, cat, grep, tar\nping, dig, wget, curl, uname, whoami, free, top, ps\necho, date, history, clear, help\n\nType any command to get started!`;
    },
    clear: () => 'CLEAR'
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const input = inputValue.trim();
      setInputValue('');
      setHistoryIndex(-1);
      setTabSuggestions([]);

      if (input) setCommandHistory(prev => [input, ...prev]);

      const promptStr = `guest@linux:~$ ${input}`;
      
      if (!input) {
        setHistory(prev => [...prev, { type: 'prompt', text: promptStr }]);
        return;
      }

      let args = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
      args = args.map(arg => arg.replace(/^"|"$/g, ''));
      const cmd = args.shift();

      let output = '';
      if (commands[cmd]) {
        output = commands[cmd](args, currentPath, fileSystem, setCurrentPath, setFileSystem, input, commandHistory);
      } else {
        output = `bash: ${cmd}: command not found`;
      }

      if (output === 'CLEAR') {
        setHistory([]);
      } else {
        setHistory(prev => [
          ...prev, 
          { type: 'prompt', text: promptStr },
          ...(output ? [{ type: 'output', text: output }] : [])
        ]);
      }

      // Check guided lab progress
      if (activeLab.type === 'guided' && labStatus === 'running') {
        const normalizedInput = input.replace(/\s+/g, ' ').trim();
        const currentStepData = activeLab.steps[guidedStep];
        
        if (normalizedInput === currentStepData.expectedCmd) {
          if (guidedStep < activeLab.steps.length - 1) {
            setGuidedStep(prev => prev + 1);
            setXp(prev => prev + 10);
            showToast('+10 XP', '⚡');
          } else {
            setLabStatus('completed');
            setXp(prev => prev + 50);
            setStreak(prev => prev + 1);
            showToast('Lab Complete! +50 XP', '🎉');
            setHistory(prev => [...prev, { type: 'success', text: '✓ Lab completed successfully!' }]);
            
            if (!completedLabs.includes(activeLab.id)) {
              setCompletedLabs(prev => [...prev, activeLab.id]);
            }
          }
        }
      }

    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = inputValue.trim();
      const allCommands = getAllCommands();
      const currentNode = getNode(fileSystem, currentPath);
      const files = currentNode && currentNode.type === 'dir' ? Object.keys(currentNode.content) : [];
      const allOptions = [...allCommands, ...files];
      const matches = allOptions.filter(cmd => cmd.startsWith(partial));
      
      if (matches.length === 1) {
        setInputValue(matches[0] + ' ');
        setTabSuggestions([]);
      } else if (matches.length > 1) {
        setTabSuggestions(matches);
      }
    }
  };

  const getLevel = (xp) => Math.floor(xp / 100) + 1;
  const getLevelProgress = (xp) => xp % 100;

  const filteredDocs = commandDocs.map(category => ({
    ...category,
    commands: category.commands.filter(c => 
      c.cmd.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.commands.length > 0);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
    advanced: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-white to-violet-50 overflow-hidden">
      
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">Terminal</h1>
              <p className="text-xs text-slate-500">Academy</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-semibold text-slate-700">Level {getLevel(xp)}</span>
              </div>
              <span className="text-xs font-bold text-violet-600">{xp} XP</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-slate-700">Streak</span>
              </div>
              <span className="text-xs font-bold text-orange-600">{streak} days</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveView('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'home' 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Home</span>
          </button>
          <button
            onClick={() => setActiveView('labs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'labs' || activeView === 'lab-active'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="font-semibold">Labs</span>
          </button>
          <button
            onClick={() => setActiveView('docs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'docs' 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">Commands</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4">
            <p className="text-xs text-slate-600 mb-2">Progress to Level {getLevel(xp) + 1}</p>
            <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500 rounded-full"
                style={{ width: `${getLevelProgress(xp)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">{getLevelProgress(xp)}/100 XP</p>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">Terminal Academy</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute top-16 left-0 right-0 bg-white p-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <nav className="space-y-2">
              <button onClick={() => { setActiveView('home'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 text-violet-700">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Home</span>
              </button>
              <button onClick={() => { setActiveView('labs'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Labs</span>
              </button>
              <button onClick={() => { setActiveView('docs'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">Commands</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0">
        
        {/* HOME VIEW */}
        {activeView === 'home' && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-6 lg:p-12 space-y-12">
              {/* Hero */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Master Linux Terminal
                </h1>
                <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
                  Learn command-line skills through interactive labs and real-world scenarios
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <button
                    onClick={() => setActiveView('labs')}
                    className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-violet-200 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Learning
                  </button>
                  <button
                    onClick={() => setActiveView('docs')}
                    className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-bold border-2 border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all"
                  >
                    View Commands
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{completedLabs.length}</p>
                      <p className="text-sm text-slate-500">Labs Completed</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">Level {getLevel(xp)}</p>
                      <p className="text-sm text-slate-500">{xp} Total XP</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Flame className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{streak}</p>
                      <p className="text-sm text-slate-500">Day Streak</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Start Labs */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Start</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {curriculum.slice(0, 4).map((lab, idx) => (
                    <div key={lab.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group" onClick={() => startLab(idx)}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{lab.icon}</div>
                        <span className={`text-xs px-3 py-1 rounded-full border ${difficultyColors[lab.difficulty]}`}>
                          {lab.difficulty}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                        {lab.title}
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">{lab.duration} • {lab.type === 'guided' ? 'Guided' : 'Practice'}</p>
                      {completedLabs.includes(lab.id) && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Completed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LABS VIEW */}
        {activeView === 'labs' && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-6 lg:p-12 space-y-8">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Training Labs</h1>
                <p className="text-slate-600">Choose a lab to practice your Linux skills</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {curriculum.map((lab, idx) => (
                  <div key={lab.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group" onClick={() => startLab(idx)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{lab.icon}</div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full border ${difficultyColors[lab.difficulty]}`}>
                          {lab.difficulty}
                        </span>
                        {completedLabs.includes(lab.id) && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                      {lab.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">{lab.duration} • {lab.type === 'guided' ? 'Step-by-step' : 'Self-paced'}</p>
                    <ul className="space-y-2 mb-4">
                      {lab.objectives.slice(0, 2).map((obj, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-violet-500 mt-1">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Start Lab
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOCS VIEW */}
        {activeView === 'docs' && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-6 lg:p-12 space-y-8">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Command Reference</h1>
                <p className="text-slate-600">Quick reference for Linux terminal commands</p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
                />
              </div>

              <div className="space-y-6">
                {filteredDocs.map((category, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        {category.category}
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {category.commands.map((cmd, cIdx) => (
                        <div key={cIdx} className="p-6 hover:bg-slate-50 transition-colors group">
                          <div className="flex items-start justify-between mb-3">
                            <code className="text-lg font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-lg">
                              {cmd.cmd}
                            </code>
                          </div>
                          <p className="text-slate-600 mb-4">{cmd.desc}</p>
                          <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                            <code className="text-green-400 font-mono text-sm">$ {cmd.usage}</code>
                            <button
                              onClick={() => handleCopy(cmd.usage)}
                              className={`p-2 rounded-lg transition-all ${copiedCmd === cmd.usage ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                            >
                              {copiedCmd === cmd.usage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LAB ACTIVE VIEW */}
        {activeView === 'lab-active' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Terminal */}
            <div className="flex-1 flex flex-col bg-slate-900">
              <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-slate-400 text-sm ml-3">terminal</span>
                </div>
                <button
                  onClick={() => {
                    setFileSystem(cloneFS(initialFileSystem));
                    setCurrentPath(['home', 'guest']);
                    setHistory([{ type: 'system', text: '🔄 Environment reset' }]);
                    if (activeLab.type === 'diy') setCompletedGoals(new Set());
                    if (activeLab.type === 'guided') setGuidedStep(0);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Reset environment"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {history.map((line, i) => (
                  <div key={i} className={`mb-2 ${
                    line.type === 'system' ? 'text-cyan-400' : 
                    line.type === 'success' ? 'text-green-400' : 
                    line.type === 'output' ? 'text-slate-300' : 
                    'text-slate-400'
                  }`}>
                    {line.text}
                  </div>
                ))}
                
                {tabSuggestions.length > 0 && (
                  <div className="text-slate-500 text-xs mb-2">
                    {tabSuggestions.join('  ')}
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">guest@linux:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleCommand}
                    className="flex-1 bg-transparent outline-none text-white caret-white"
                    autoFocus
                  />
                </div>
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Lab Instructions Panel */}
            <div className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col max-h-[50vh] lg:max-h-full">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white">
                <button
                  onClick={() => setActiveView('labs')}
                  className="text-white/80 hover:text-white mb-2 text-sm flex items-center gap-1"
                >
                  ← Back to Labs
                </button>
                <h3 className="font-bold text-lg">{activeLab.title}</h3>
                <p className="text-sm text-white/80">{activeLab.type === 'guided' ? 'Guided Lab' : 'Practice Lab'}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {labStatus === 'running' && activeLab.type === 'guided' && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Step {guidedStep + 1} of {activeLab.steps.length}</span>
                        <span>{Math.round(((guidedStep) / activeLab.steps.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
                          style={{ width: `${((guidedStep) / activeLab.steps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Instructions</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {activeLab.steps[guidedStep].instruction}
                      </p>
                    </div>

                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-violet-900 mb-2">REQUIRED COMMAND</p>
                      <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-between">
                        <code className="text-green-400 text-sm">$ {activeLab.steps[guidedStep].expectedCmd}</code>
                        <button
                          onClick={() => handleCopy(activeLab.steps[guidedStep].expectedCmd)}
                          className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                        >
                          {copiedCmd === activeLab.steps[guidedStep].expectedCmd ? 
                            <Check className="w-4 h-4 text-green-400" /> : 
                            <Copy className="w-4 h-4 text-slate-400" />
                          }
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {labStatus === 'running' && activeLab.type === 'diy' && (
                  <>
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                      <h4 className="font-bold text-violet-900 mb-2">Scenario</h4>
                      <p className="text-sm text-violet-800">{activeLab.scenario}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-3">Objectives</h4>
                      <div className="space-y-2">
                        {activeLab.goals.map((goal) => {
                          const isDone = completedGoals.has(goal.id);
                          return (
                            <div
                              key={goal.id}
                              className={`flex items-start gap-3 p-3 rounded-xl border ${
                                isDone ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0 mt-0.5"></div>
                              )}
                              <span className={`text-sm ${isDone ? 'text-green-900 font-medium' : 'text-slate-700'}`}>
                                {goal.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {labStatus === 'completed' && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab Complete!</h3>
                    <p className="text-slate-600 mb-6">You've mastered this lab</p>
                    <button
                      onClick={() => {
                        const nextIndex = (activeLabIndex + 1) % curriculum.length;
                        startLab(nextIndex);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Next Lab →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
