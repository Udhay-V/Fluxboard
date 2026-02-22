import React, { memo, useCallback, useState, useRef } from 'react';
import type { Order, Task, TaskId } from '../types';
import '../styles.css';

interface TaskCardProps {
    task: Task;
    timeAgo: string;
    status: keyof Order;
    style?: React.CSSProperties;
    onDragStart?: (e: React.DragEvent) => void;
    onDelete?: (id: TaskId) => void;
    onUpdate?: (update: { id: TaskId; updates: Partial<Task> }) => void;
}

export const TaskCard = memo<TaskCardProps>(function TaskCard({
    task,
    timeAgo,
    status,
    style,
    onDragStart,
    onDelete,
    onUpdate,
}) {
    const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description);
    const containerRef = useRef<HTMLDivElement>(null);

    const priorityColor = task.priority === 3 ? '#f44336' :
        task.priority === 2 ? '#ff9800' : '#4caf50';

    const handleTitleSave = useCallback(() => {
        const trimmedTitle = editTitle.trim();
        if (onUpdate && trimmedTitle !== task.title) {
            onUpdate({
                id: task.id,
                updates: { title: trimmedTitle || task.title }
            });
        }
        setEditingField(null);
    }, [task.id, task.title, editTitle, onUpdate]);

 
    const handleDescSave = useCallback(() => {
        const trimmedDesc = editDesc.trim();
        if (onUpdate && trimmedDesc !== task.description) {
            onUpdate({
                id: task.id,
                updates: { description: trimmedDesc || task.description }
            });
        }
        setEditingField(null);
    }, [task.id, task.description, editDesc, onUpdate]);

    const handleTitleEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setEditTitle(task.title);
        setEditingField('title');
    }, [task.title]);


    const handleDescEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setEditDesc(task.description);
        setEditingField('description');
    }, [task.description]);

    const handleCancel = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingField(null);
    }, []);

    return (
        <div
            ref={containerRef}
            className="task-card"
            style={style}
            draggable={!editingField}
            onDragStart={onDragStart}
        >
            <div className="task-header">
                <div className="priority-dot" style={{ backgroundColor: priorityColor }} />
                <div className="title-section">
                    {editingField === 'title' ? (
                        <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="edit-title"
                            autoFocus
                            placeholder="Task title..."
                            onBlur={handleTitleSave}
                            onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter') handleTitleSave();
                                else if (e.key === 'Escape') handleCancel(e);
                            }}
                        />
                    ) : (
                        <span
                            className="task-title"
                            onClick={handleTitleEdit}
                            title="Click to edit title"
                        >
                            {task.title}
                        </span>
                    )}
                </div>

                <div className="priority-badge">
                    {task.priority === 1 && (
                        <span style={{ background: '#4caf50', color: 'white', fontSize: 12, padding: 3, borderRadius: 4 }}>Low</span>
                    )}
                    {task.priority === 2 && (
                        <span style={{ background: '#ff9800', color: 'white', fontSize: 12, padding: 3, borderRadius: 4 }}>Med</span>
                    )}
                    {task.priority === 3 && (
                        <span style={{ background: '#f44336', color: 'white', fontSize: 12, padding: 3, borderRadius: 4 }}>High</span>
                    )}
                </div>

                <div className="task-actions">
                    {editingField && (
                        <>
                            <button className="save-btn" onClick={handleCancel} title="Cancel (Escape)">✓</button>
                        </>
                    )}
                    <button
                        className="delete-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(task.id);
                        }}
                        title="Delete task"
                    >
                        ×
                    </button>
                </div>
            </div>

            {editingField === 'description' ? (
                <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="edit-desc"
                    placeholder="Task description..."
                    rows={3}
                    onBlur={handleDescSave}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && e.ctrlKey) handleDescSave();
                        else if (e.key === 'Escape') handleCancel(e);
                    }}
                />
            ) : (
                <p
                    className="task-description"
                    onClick={handleDescEdit}
                    title="Click to edit description"
                >
                    {task.description || 'No description • click to add'}
                </p>
            )}

            <div className="task-footer">
                <span className="status-badge">{status.replace('-', ' ').toUpperCase()}</span>
                <span className="time-ago">{timeAgo} ago</span>
            </div>
        </div>
    );
});
