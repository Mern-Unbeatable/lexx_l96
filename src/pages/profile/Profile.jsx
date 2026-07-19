import { useMemo, useState } from 'react'
import ProfileHeader from './components/ProfileHeader'
import ProfileStats from './components/ProfileStats'
import PersonalDetails from './components/PersonalDetails'
import MembershipCard from './components/MembershipCard'
import ProfileFooter from './components/ProfileFooter'
import EditPersonalDetailsModal from './components/EditPersonalDetailsModal'
import { useAuth } from '../../context/AuthContext'
import {
  ProfileLoading,
  ProfileLoadError,
  ProfileSignInRequired,
} from './components/ProfilePageStates'
import {
  getInitials,
  getProfileFullName,
  mapUserToProfile,
} from './utils/profileMapper'

const Profile = () => {
  const {
    user,
    isAuthenticated,
    isLoadingUser,
    userError,
    refetchUser,
  } = useAuth()
  const [profileEdits, setProfileEdits] = useState({})
  const [editOpen, setEditOpen] = useState(false)
  const profile = useMemo(
    () => ({ ...mapUserToProfile(user), ...profileEdits }),
    [profileEdits, user],
  )
  const fullName = getProfileFullName(profile)

  const handleSave = (data) => {
    setProfileEdits((prev) => ({
      ...prev,
      ...data,
      initials: getInitials(data.firstName, data.lastName),
    }))
  }

  if (isLoadingUser) return <ProfileLoading />

  if (!isAuthenticated) return <ProfileSignInRequired />

  if (userError || !user) {
    return (
      <ProfileLoadError
        error={userError}
        onRetry={() => refetchUser()}
      />
    )
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
