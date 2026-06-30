import { useState } from "react"
import { Search } from "lucide-react"

const SubjectList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  return (
    <div>
      <h1 className='page-title'>Subjects</h1>
      <div className='intro-row'>
        <p>Quick access to financial metrics an management tools</p>
        <div className='actions-row'>
          <div className='search-field'>
            <Search className='search-icon' />
            <input
              className="h-10 w-full rounded-lg border border-[#c7c4d8] bg-white px-10 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#777587] focus:ring-2 focus:ring-[#4f46e5]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects"
              type="search"
            />
          </div>
        </div>
        <div className='flex items-center gap-2 sm:w-auto'>
          <select
            className="h-10 w-48 rounded-lg border border-[#c7c4d8] bg-white px-3 text-sm text-[#0b1c30] outline-none transition focus:ring-2 focus:ring-[#4f46e5]"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Department</option>
            <option value="science">Science</option>
            <option value="arts">Arts</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SubjectList
