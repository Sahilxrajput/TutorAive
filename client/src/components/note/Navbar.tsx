import { Archive, Plus, Trash2 } from 'lucide-react';
import React, { type JSX } from 'react'
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
    //! @remind
    const notes ={}
  return (
      <div className="flex w-full justify-between items-center flex-wrap gap-2">

          <div className="space-x-2 flex items-center justify-center">
              {["active", "archived", "trashed"].map((type) => {
                  const isActive = status === type;
                  const icons: Record<string, JSX.Element> = {
                      active: <></>,
                      archived: <Archive className="w-4 h-4 mr-1" />,
                      trashed: <Trash2 className="w-4 h-4 mr-1" />,
                  };
                  return (
                      <Button
                          key={type}
                          variant={isActive ? "default" : "outline"}
                        //   onClick={() => setStatus(type as any)}
                      >
                          {icons[type]}
                          {type === "active"
                              ? "All Notes"
                              : type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                  );
              })}
          </div>

          {status === "active" && (
              <Link to="/notes/new"
                  className="flex items-center justify-center shadow-sm hover:shadow-md border-2 p-2 rounded-lg text-sm gap-2"
              >
                  <Plus className="w-4 h-4" />
                  New Note
              </Link>
          )}

          {status === "trashed" && notes?.length > 0 && (
              <Button variant="destructive"
            //    onClick={handleClearAllTrashed}
               >
                  Clear All Trashed Notes
              </Button>
          )}
      </div>  )
}

export default Navbar