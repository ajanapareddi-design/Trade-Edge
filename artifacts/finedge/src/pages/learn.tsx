import { useEffect } from "react";
import { useGetTodayLesson, useGetUpcomingLessons, useGetLearningStreak, useCheckInStreak } from "@workspace/api-client-react";
import { format, subDays, isSameDay } from "date-fns";
import { Flame, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function LearnPage() {
  const { data: todayLesson, isLoading: loadingLesson } = useGetTodayLesson();
  const { data: upcomingLessons, isLoading: loadingUpcoming } = useGetUpcomingLessons();
  const { data: streak, isLoading: loadingStreak } = useGetLearningStreak();
  const checkIn = useCheckInStreak();

  useEffect(() => {
    // Record check-in when the page loads
    checkIn.mutate(undefined);
  }, []);

  const today = new Date();
  
  // Generate last 30 days for streak calendar
  const last30Days = Array.from({ length: 30 }).map((_, i) => subDays(today, 29 - i));
  const checkinDates = streak?.checkinDates ? streak.checkinDates.map(d => new Date(d)) : [];

  return (
    <div className="flex-1 overflow-auto bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header>
          <p className="text-muted-foreground font-medium mb-1">{format(today, "EEEE, MMMM d")}</p>
          <h1 className="text-3xl font-bold tracking-tight">Today's Lesson</h1>
        </header>

        {/* Main Lesson Card */}
        {loadingLesson ? (
          <Skeleton className="w-full h-80 rounded-2xl" />
        ) : todayLesson ? (
          <Card className="border-border bg-card overflow-hidden shadow-md">
            <div className="h-2 bg-gradient-to-r from-primary to-secondary w-full" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {todayLesson.title}
                </h2>
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold">
                  #{todayLesson.tag}
                </div>
              </div>

              <p className="text-lg text-foreground/90 leading-relaxed">
                {todayLesson.explanation}
              </p>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Why it matters
                </h3>
                <p className="text-muted-foreground">
                  {todayLesson.whyItMatters}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  How it works
                </h3>
                <ul className="space-y-3">
                  {todayLesson.howItWorks.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 min-w-5 flex justify-center">
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="text-foreground/80">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-8 text-center border-border bg-card">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No lesson available today. Check back tomorrow!</p>
          </Card>
        )}

        {/* Upcoming Lessons */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Upcoming</h3>
            <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {loadingUpcoming ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-64 h-32 rounded-xl shrink-0 snap-center" />
              ))
            ) : upcomingLessons?.map((lesson) => (
              <Card key={lesson.id} className="w-64 shrink-0 snap-center border-border bg-card/60 backdrop-blur-md">
                <CardContent className="p-5 flex flex-col h-full justify-between opacity-70">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      Day {lesson.dayIndex}
                    </div>
                    <h4 className="font-bold text-lg leading-tight line-clamp-2">
                      {lesson.title}
                    </h4>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md text-muted-foreground">
                      {lesson.tag}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Learning Streak */}
        <section className="pt-4">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Learning Streak</h3>
                  <p className="text-muted-foreground text-sm">
                    {loadingStreak ? "..." : `${streak?.currentStreak || 0} days in a row (Best: ${streak?.longestStreak || 0})`}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-10 sm:grid-cols-15 gap-2">
                {last30Days.map((date, i) => {
                  const isCheckedIn = checkinDates.some(d => isSameDay(d, date));
                  const isToday = isSameDay(today, date);
                  return (
                    <div 
                      key={i}
                      className={`h-8 rounded-sm ${
                        isCheckedIn 
                          ? "bg-chart-2 shadow-[0_0_8px_rgba(0,200,150,0.4)]" 
                          : "bg-muted"
                      } ${isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                      title={format(date, "MMM d")}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
