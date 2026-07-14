import { Flag, Trophy, Users, Calendar } from 'lucide-react'
import StatCard from './StatCard'

const ProfileStats = ({ profile }) => (
  <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      icon={Flag}
      value={profile.handicap}
      label="Current Handicap"
    />
    <StatCard
      icon={Trophy}
      value={profile.roundsPlayed}
      label="Rounds Played"
    />
    <StatCard
      icon={Users}
      value={profile.roundsHosted}
      label="Rounds Hosted"
    />
    <StatCard
      icon={Calendar}
      value={profile.memberSince}
      label="Member Since"
    />
  </div>
)

export default ProfileStats
