import { useState } from 'react'
import { profile as initialProfile } from './data/profileData'
import ProfileHeader from './components/ProfileHeader'
import ProfileStats from './components/ProfileStats'
import PersonalDetails from './components/PersonalDetails'
import GolfDetails from './components/GolfDetails'
import MembershipCard from './components/MembershipCard'
import ProfileFooter from './components/ProfileFooter'
import EditPersonalDetailsModal from './components/EditPersonalDetailsModal'

const getInitials = (firstName, lastName) =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile)
  const [editOpen, setEditOpen] = useState(false)
  const fullName = `${profile.firstName} ${profile.lastName}`

  const handleSave = (data) => {
    setProfile((prev) => ({
      ...prev,
      ...data,
      initials: getInitials(data.firstName, data.lastName),
    }))
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full container flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <ProfileHeader
          profile={profile}
          fullName={fullName}
          onEdit={() => setEditOpen(true)}
        />
        <ProfileStats profile={profile} />

        <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-2">
          <PersonalDetails profile={profile} />
          <div className="flex flex-col gap-5">
            <GolfDetails profile={profile} />
            <MembershipCard profile={profile} fullName={fullName} />
          </div>
        </div>
      </div>
      <ProfileFooter />

      <EditPersonalDetailsModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

export default Profile
