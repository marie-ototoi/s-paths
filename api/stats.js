import express from 'express'
import queryLib from '../src/lib/queryLib'
const router = express.Router()
const endpoint = 'http://wilda.lri.fr:3030/nobel/sparql'

router.get('/:class', (req, res) => {
    console.log("c'est parti", req.params)
    res.send("c'est parti")
    const constraints = ''
    const entrypoint = req.params.class
    const prefixes = { nobel: 'http://data.nobelprize.org/terms/' }
    queryLib.getData(endpoint, queryLib.makePropsQuery(entrypoint, constraints, 1), prefixes)
        .then(props => {
            console.log(props.results.bindings[0])
            const groupedProps = props.results.bindings.map(prop => {
                return queryLib.defineGroup(prop, entrypoint, 1, prefixes)
            }).filter(prop => (prop.group !== 'ignore'))
            return Promise.all(groupedProps.map(prop => queryLib.makePropQuery(prop.path, constraints)))
        })
        .then(props => {
            console.log(props[0])
        })

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
router.post('/:class', (req, res) => {
    console.log("c'est parti")
})

router.post('/:class/:constraint', (req, res) => {
    // for later, store preprocessing in the data base
})

export default router
