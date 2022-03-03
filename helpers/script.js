
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

async function getCurrentCoursesWithName(id) {
  const currentCourses = (await Student.findById(req.user._id)).current
  for (const currentCourse of currentCourses) {
    const currentCourse = await Course.findById(current.courseId)
    currentCourse.courseName = course.name
  }

  return currentCourses
}

module.exports = {
  checkNotAuthenticated: checkNotAuthenticated,
  checkAuthenticated: checkAuthenticated,
}

