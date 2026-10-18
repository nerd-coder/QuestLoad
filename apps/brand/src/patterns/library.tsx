import { EllipsisIcon, PlayIcon, RotateCwIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const apps = [
  {
    name: 'Into the Radius',
    pkg: 'com.CMGames.IntoTheRadius',
    size: '1.4 GB',
    sky: '#2B4C7E',
    sun: '#F2A65A',
  },
  {
    name: 'Lumen Drift',
    pkg: 'dev.lumenworks.drift',
    size: '412 MB',
    sky: '#1F5E52',
    sun: '#E9D8A6',
  },
  {
    name: 'Paper Rockets',
    pkg: 'io.paperrockets.app',
    size: '96 MB',
    sky: '#4B3381',
    sun: '#FF8FA3',
  },
  {
    name: 'Quiet Orbit',
    pkg: 'net.quietorbit.vr',
    size: '238 MB',
    sky: '#7A2833',
    sun: '#FCE38A',
  },
]

// Mirrors Apps › Unknown Sources in the headset, where sideloaded apps land.
export function Library() {
  return (
    <ul className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
      {apps.map((app) => (
        <li key={app.pkg} className="min-w-0">
          <button
            type="button"
            className="lift relative block aspect-[16/10] w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-border"
            style={{ backgroundColor: app.sky }}
            aria-label={`Open ${app.name} on Quest`}
          >
            <span
              aria-hidden="true"
              className="absolute -right-6 -bottom-10 size-32 rounded-full"
              style={{ backgroundColor: app.sun }}
            />
          </button>
          <div className="mt-3 flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{app.name}</p>
              <p className="truncate font-mono text-xs text-muted-foreground">
                {app.pkg}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`More for ${app.name}`}
                  />
                }
              >
                <EllipsisIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <PlayIcon />
                    Open on Quest
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RotateCwIcon />
                    Reinstall
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  Uninstall ({app.size})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </li>
      ))}
    </ul>
  )
}
