import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects"
            />
          </div>
        </div>
        <div className='flex items-center gap-2 sm:w-auto'>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default SubjectList
