import { Users, Award, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const Index = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      description: '+12% from last month',
      gradient: 'gradient-purple',
    },
    {
      title: 'Active Skills',
      value: '456',
      icon: Award,
      description: '+8% from last month',
      gradient: 'gradient-pink',
    },
    {
      title: 'Growth Rate',
      value: '23%',
      icon: TrendingUp,
      description: '+4% from last month',
      gradient: 'gradient-cyan',
    },
    {
      title: 'Active Sessions',
      value: '89',
      icon: Activity,
      description: 'Real-time activity',
      gradient: 'gradient-green',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to SkillsAlpha Hub - Manage your organization's skills and competencies
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.gradient} p-2 rounded-lg shadow-purple-glow`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Get started with common tasks:
            </div>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Create new user profiles</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span>Upload bulk data</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Configure skill matrices</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Latest updates in your organization:
            </div>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <div>
                  <div className="font-medium">New user added</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-info mt-1.5"></div>
                <div>
                  <div className="font-medium">Skills updated</div>
                  <div className="text-xs text-muted-foreground">5 hours ago</div>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success mt-1.5"></div>
                <div>
                  <div className="font-medium">Bulk upload completed</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
