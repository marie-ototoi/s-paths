import express from 'express'
import { SparqlClient, SPARQL } from 'sparql-client-2'

const router = express.Router()

router.get('/:class', function getStats (req, res) {
    console.log("c'est parti")
    res.send("c'est parti")
    /* Promise.all([
        Day.getFirstDay(),
        Day.getLastDay(),
        CalendarStream.getCalendars()
    ])
    .then(([dateStart, dateEnd, calendars]) => {
        res.render('config', {
            title: 'Planning CIFRE - Configuration',
            dateStart: dateStart[0]._id,
            dateEnd: dateEnd[0]._id,
            calendarUrls: JSON.stringify(calendars.map(calendar => calendar.url))
        })
        res.end()
    })
    .catch((err) => {
        req.flash('error', 'Error while getting the data ' + err)
        res.render('config', {title: 'Planning CIFRE - Configuration'})
    }) */
})
router.post('/:class', function getStats (req, res) {
    console.log("c'est parti")
})

router.post('/:class/:constraint', function setStats (req, res) {
    // for later, store preprocessing in the data base
})

export default router
