import {NavLink} from "remix";

const linkActiveClassName = 'text-violet-900 hover:border-violet-900 border-b-2';
const linkInactiveClassName = 'text-gray-800 hover:border-gray-800 hover:border-b-2';

export default function NavBar() {
  return (
    <header>
      <div>
        <nav aria-label="Main navigation" className="px-10 sm:px-20 pt-10">
          <ul className="flex justify-end">
            <li>
              <NavLink className={({isActive}) => isActive ? linkActiveClassName : linkInactiveClassName} to="/">home</NavLink>
            </li>
            <li className="pl-10">
              <NavLink className={({isActive}) => isActive ? linkActiveClassName : linkInactiveClassName} to="/my-work">my work</NavLink>
            </li>
            <li className="pl-10">
              <NavLink className={({isActive}) => isActive ? linkActiveClassName : linkInactiveClassName} to="/contact-me">contact me</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
